import {Device, Setting} from "../models";

const PORT = 21195;

const BASE_API_PATH = `http://localhost:${PORT}/api`;

const SETTINGS_PATH = `${BASE_API_PATH}/settings`;
const DISCOVERY_PATH = `${BASE_API_PATH}/discovery`;
const WOL_PATH = `${BASE_API_PATH}/wol`;

export const getSetting = async (setting: string): Promise<Setting> => {
    const response = await fetch(`${SETTINGS_PATH}/${setting}`);

    return response.json();
}

export const saveSetting = async (setting: Setting): Promise<Setting> => {
    const response = await fetch(SETTINGS_PATH, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(setting),
    });

    return response.json();
}

export const getDiscoveredDevices = async (): Promise<Device[]> => {
    const response = await fetch(`${DISCOVERY_PATH}/devices`);

    return response.json();
}

export const runDeviceDiscovery = async (): Promise<void> => {
    await fetch(`${DISCOVERY_PATH}/run-discovery`, {
        method: "POST",
    });
}

export const wakeDevice = async (device: string): Promise<number> => {
    const response = await fetch(`${WOL_PATH}/${device}`, {
        method: "POST",
    });

    return response.json();
}