mod settings;
mod discovery;
mod wol;

use std::error::Error;
use std::sync::RwLock;
use actix_cors::Cors;
use actix_web::middleware::Logger;
use actix_web::web::scope;
use env_logger::Env;
use crate::discovery::services::DiscoveryService;
use crate::settings::services::SettingsService;
use crate::wol::services::WolService;

#[actix_web::main]
async fn main() -> Result<(), ()> {
    println!("Starting server...");

    env_logger::init_from_env(Env::default().default_filter_or("debug"));

    let settings_service = SettingsService::new();
    let discovery_service = DiscoveryService::new();
    let wol_service = WolService::new();

    println!("Starting web server...");

    // Start actix server
    actix_web::HttpServer::new(move || {
        let mut app = actix_web::App::new()
            .app_data(actix_web::web::Data::new(settings_service.clone()))
            .app_data(actix_web::web::Data::new(RwLock::new(discovery_service.clone())))
            .app_data(actix_web::web::Data::new(wol_service.clone()))
            .wrap(Logger::default())
            .wrap(Cors::permissive()) // TODO: This is insecure!
            .service(scope("/api")
                .service(settings::routes::get_routes())
                .service(discovery::routes::get_routes())
                .service(wol::routes::get_routes())
            );

        app
    })
        .bind(("0.0.0.0", 21195))
        .unwrap()
        .run()
        .await
        .unwrap();

    Ok(())
}