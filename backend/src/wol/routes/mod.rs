use actix_web::post;
use actix_web::web::{Data, Json, Path};
use crate::wol::services::WolService;

pub fn get_routes() -> actix_web::Scope {
    actix_web::web::scope("/wol")
        .service(send_wol)
}

#[post("/{mac}")]
async fn send_wol(
    path: Path<String>,
    wol_service: Data<WolService>,
) -> Json<()> {
    wol_service.send_wol_packet(&path.into_inner()).await.unwrap();

    Json(())
}