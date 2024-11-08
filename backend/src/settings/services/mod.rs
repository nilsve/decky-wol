use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use thiserror::Error;
use crate::settings::models::Setting;

#[derive(Clone)]
pub struct SettingsService {}

#[derive(Debug, Serialize, Deserialize)]
pub struct SettingsFile {
    pub settings: HashMap<String, String>,
}

const SETTINGS_FOLDER: &str = ".config/decky-wol";
const SETTINGS_FILE_NAME: &str = "settings.json";

#[derive(Debug, Error)]
pub enum SettingError {
    #[error("Error reading settings file: {0}")]
    FileReadError(#[from] std::io::Error),
    #[error("Error parsing settings file: {0}")]
    FileParseError(#[from] serde_json::Error),
}

pub type SettingResult<T> = Result<T, SettingError>;

impl SettingsService {
    pub fn new() -> Self {
        let service = Self {};

        match service.get_settings() {
            Ok(_) => (),
            Err(_) => {
                service.create_settings_folder().unwrap();
                service.create_settings_file().unwrap();
            }
        }

        service
    }

    fn get_settings_file_path(&self) -> SettingResult<std::path::PathBuf> {
        let home_dir = home::home_dir().unwrap();
        let settings_file_path = home_dir.join(SETTINGS_FOLDER).join(SETTINGS_FILE_NAME);

        Ok(settings_file_path)
    }

    fn create_settings_folder(&self) -> SettingResult<()> {
        let home_dir = home::home_dir().unwrap();
        let settings_folder = home_dir.join(SETTINGS_FOLDER);

        std::fs::create_dir_all(settings_folder)?;

        Ok(())
    }

    fn create_settings_file(&self) -> SettingResult<SettingsFile> {
        let settings_file = SettingsFile {
            settings: HashMap::new(),
        };

        let settings_file_contents = serde_json::to_string(&settings_file)?;

        std::fs::write(self.get_settings_file_path()?, settings_file_contents)?;

        Ok(settings_file)
    }

    fn get_settings(&self) -> SettingResult<SettingsFile> {
        let settings_file_contents = std::fs::read_to_string(self.get_settings_file_path()?)?;

        let settings_file: SettingsFile = serde_json::from_str(&settings_file_contents)?;

        Ok(settings_file)
    }

    pub fn get_setting(&self, setting_name: String) -> SettingResult<Setting> {
        let settings = self.get_settings()?;

        Ok(settings.settings.get(&setting_name)
            .map(|value| Setting {
                name: setting_name.clone(),
                value: value.clone(),
            })
            .unwrap_or(Setting {
                name: setting_name,
                value: "".to_string(),
            }))
    }

    pub fn save_setting(&self, setting: Setting) -> SettingResult<Setting> {
        let mut settings = self.get_settings()?;

        settings.settings.insert(setting.name.clone(), setting.value.clone());

        let settings_file_contents = serde_json::to_string(&settings)?;

        std::fs::write(self.get_settings_file_path()?, settings_file_contents)?;

        Ok(setting)
    }
}