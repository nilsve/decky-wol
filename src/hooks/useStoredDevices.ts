import { useSetting } from "./useSetting";
import {useCallback, useMemo} from "react";
import {Device} from "../models";

export const useStoredDevices = () => {
    const {
        value: serializedDevices,
        updateValue: updateSerializedDevices
    } = useSetting("devices");

    const devices = useMemo(() => {
        if (!serializedDevices) {
            return [];
        }

        return JSON.parse(serializedDevices) as Device[];
    }, [serializedDevices]);

    const upsertDevice = useCallback(async (device: Device) => {
        if (devices.some(d => d.mac_address === device.mac_address)) {
            await updateSerializedDevices(JSON.stringify(devices.map(d => d.mac_address === device.mac_address ? device : d)));
            return;
        }

        await updateSerializedDevices(JSON.stringify([...devices, device]));
    }, [updateSerializedDevices]);

    const removeDevice = useCallback(async (device: Device) => {
        await updateSerializedDevices(JSON.stringify(devices.filter(d => d.mac_address !== device.mac_address)));
    }, [updateSerializedDevices]);

    return {
        devices,
        upsertDevice,
        removeDevice
    };
}