use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct Setting {
    pub name: String,
    pub value: String,
}