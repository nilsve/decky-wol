use std::sync::RwLock;
use actix_web::{get, post};
use actix_web::web::{Data, Json, Path};
use tokio::sync::Mutex;
use crate::discovery::models::Device;
use crate::discovery::services::DiscoveryService;

pub fn get_routes() -> actix_web::Scope {
    actix_web::web::scope("/discovery")
        .service(get_discovered_devices)
        .service(run_discovery)
}

#[get("/devices")]
async fn get_discovered_devices(
    discovery_service: Data<RwLock<DiscoveryService>>,
) -> Json<Vec<Device>> {
    let setting = discovery_service.read().unwrap().get_discovered_devices().unwrap();

    Json(setting)
}

#[post("/run-discovery")]
async fn run_discovery(
    mut discovery_service: Data<RwLock<DiscoveryService>>,
) -> Json<()> {
    discovery_service.write().unwrap().start_discovery().await.unwrap();

    Json(())
}