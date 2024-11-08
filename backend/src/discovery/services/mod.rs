use std::collections::HashMap;
use std::net::{IpAddr, Ipv4Addr};
use std::process::Command;
use std::str::FromStr;
use std::sync::Arc;
use std::sync::atomic::AtomicBool;
use std::time::Duration;
use ping::ping;
use thiserror::Error;
use crate::discovery::models::Device;
use crate::discovery::services::DiscoveryError::RunCommandError;

#[derive(Clone)]
pub struct DiscoveryService {
    is_running: Arc<AtomicBool>,
}

#[derive(Error, Debug)]
pub enum DiscoveryError {
    #[error("Default gateway not found")]
    DefaultGatewayNotFound,
    #[error("Error parsing address from ARP table: {0}")]
    AddrParseError(#[from] std::net::AddrParseError),
    #[error("Error running command: {0}")]
    RunCommandError(#[from] std::io::Error),
}

pub type DiscoveryResult<T> = Result<T, DiscoveryError>;

impl DiscoveryService {
    pub fn new() -> Self {
        DiscoveryService {
            is_running: Arc::new(AtomicBool::new(false)),
        }
    }

    fn get_default_gateway(&self) -> DiscoveryResult<String> {
        let output = Command::new("ip")
            .arg("route")
            .output()
            .map_err(|e| RunCommandError(e))?;

        let output_str = String::from_utf8_lossy(&output.stdout);
        for line in output_str.lines() {
            if line.starts_with("default via") {
                let parts: Vec<&str> = line.split_whitespace().collect();
                if parts.len() > 2 {
                    return Ok(parts[2].to_string());
                }
            }
        }

        Err(DiscoveryError::DefaultGatewayNotFound)
    }

    pub async fn start_discovery(&mut self) -> DiscoveryResult<()> {
        if self.is_running.load(std::sync::atomic::Ordering::Relaxed) {
            return Ok(());
        }

        let default_gateway = self.get_default_gateway()?;

        // Launch run_discovery on new thread
        let handle = tokio::task::spawn_blocking(move || {
            Self::run_discovery(default_gateway).unwrap();
        });

        let is_running = self.is_running.clone();
        tokio::spawn(async move {
            handle.await.unwrap();

            // Set is_running to false
            is_running.store(false, std::sync::atomic::Ordering::Relaxed);
        });

        Ok(())
    }

    fn run_discovery(default_gateway: String) -> DiscoveryResult<()> {
        let subnet = Ipv4Addr::from_str(&default_gateway)?;

        let timeout = Duration::from_millis(100);

        for i in 0..254 {
            let ip = Ipv4Addr::new(subnet.octets()[0], subnet.octets()[1], subnet.octets()[2], i);
            match ping(IpAddr::V4(ip), Some(timeout), None, None, None, None) {
                Ok(()) => {
                    println!("Ping to {} successful!", ip);
                }
                Err(e) => {
                    println!("Ping to {} failed: {:?}", ip, e);
                }
            }
        }

        Ok(())
    }

    pub fn get_discovered_devices(&self) -> DiscoveryResult<Vec<Device>> {
        let output = Command::new("ip")
            .arg("neigh")
            .output()
            .map_err(|e| RunCommandError(e))?;

        let output_str = String::from_utf8_lossy(&output.stdout);
        let mut arp_table = HashMap::new();

        for line in output_str.lines() {
            let parts: Vec<&str> = line.split_whitespace().collect();
            if parts.len() >= 5 {
                let ip = IpAddr::from_str(parts[0])?;
                let mac = parts[4].to_string();
                arp_table.insert(ip, mac);
            }
        }

        Ok(arp_table.into_iter().enumerate().map(|(i, (ip, mac))| {
            Device {
                nickname: "".to_owned(),
                mac_address: mac,
                ip_address: ip.to_string(),
            }
        }).collect())
    }
}