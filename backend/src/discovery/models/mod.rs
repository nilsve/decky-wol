use serde::Serialize;

#[derive(Debug, Serialize, Clone)]
pub struct Device {
    pub mac_address: String,
    pub ip_address: String,
    pub nickname: String,
}