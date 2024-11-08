import {useCallback, useEffect, useState} from "react";
import {Device} from "../models";
import {getDiscoveredDevices, runDeviceDiscovery} from "../api";

export const useDiscoveredDevices = () => {
    const [discoveredDevices, setDiscoveredDevices] = useState<Device[]>([]);

    useEffect(() => {
        let shouldStop = false;
        let runningTimeout: number | undefined;

        const fetchDevices = async () => {
            runningTimeout = undefined;
            const devices = await getDiscoveredDevices();

            const mappedDevices = devices.map((device) => {
                const mappedDevice: Device = {
                    nickname: device.nickname || '',
                    mac_address: device.mac_address.toUpperCase(),
                    ip_address: device.ip_address || '',
                }

                return mappedDevice;
            });

            mappedDevices.sort((a, b) => {
                return a.ip_address.localeCompare(b.ip_address);
            });

            setDiscoveredDevices(mappedDevices);

            // Fetch devices every 5 seconds
            if (!shouldStop) {
                runningTimeout = setTimeout(fetchDevices, 5000) as unknown as number;
            }
        };

        void fetchDevices();

        return () => {
            shouldStop = true;

            if (runningTimeout !== undefined) {
                clearTimeout(runningTimeout);
            }
        };
    }, []);

    const runDiscovery = useCallback(async () => {
        await runDeviceDiscovery();
    }, []);

    return {
        discoveredDevices,
        runDiscovery
    };
}