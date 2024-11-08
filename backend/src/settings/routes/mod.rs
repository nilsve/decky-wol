use actix_web::{get, put};
use actix_web::web::{Data, Json, Path};
use crate::settings::models::Setting;
use crate::settings::services::SettingsService;

pub fn get_routes() -> actix_web::Scope {
    actix_web::web::scope("/settings")
        .service(get_setting)
        .service(put_setting)
}

#[get("/{setting_name}")]
async fn get_setting(
    path: Path<String>,
    settings_service: Data<SettingsService>,
) -> Json<Setting> {
    let setting = settings_service.get_setting(path.into_inner()).unwrap();

    Json(setting)
}

#[put("")]
async fn put_setting(
    setting: Json<Setting>,
    settings_service: Data<SettingsService>,
) -> Json<Setting> {
    let setting = settings_service.save_setting(setting.into_inner()).unwrap();

    Json(setting)
}