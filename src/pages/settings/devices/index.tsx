import {ButtonItem, PanelSection, PanelSectionRow, showModal} from '@decky/ui';
import {useStoredDevices} from "../../../hooks/useStoredDevices";
import {Device} from "../../../models";
import {useCallback, useEffect} from "react";
import {useDiscoveredDevices} from "../../../hooks/useDiscoveredDevices";
import React from 'react';
import {UpdateDeviceModal} from "./update-device-modal";

export const DevicesPage = () => {
    const {
        devices,
        upsertDevice,
        removeDevice
    } = useStoredDevices();

    const {
        discoveredDevices,
        runDiscovery
    } = useDiscoveredDevices();

    useEffect(() => {
        void runDiscovery();
    }, [runDiscovery]);

    const handleSaveDevice = useCallback(async (device: Device) => {
        await upsertDevice(device);
    }, []);

    const handleDeleteDevice = useCallback(async (device: Device) => {
        await removeDevice(device);
    }, []);

    const handleClickSavedDevice = useCallback((device: Device) => {
        showModal(<UpdateDeviceModal device={device} onSave={handleSaveDevice} onDelete={handleDeleteDevice} />);
    }, []);

    const handleClickDiscoveredDevice = useCallback((device: Device) => {
        showModal(<UpdateDeviceModal device={device} onSave={handleSaveDevice} />);
    }, []);

    const renderSavedDevices = devices.map((device) => {
        return (
            <PanelSectionRow key={device.mac_address}>
                <ButtonItem
                    layout="below"
                    onClick={() => handleClickSavedDevice(device)}
                >
                    {device.nickname || device.ip_address} - {device.mac_address}
                </ButtonItem>
            </PanelSectionRow>
        );
    });

    const renderDiscoveredDevices = discoveredDevices.map((device) => {
        return (
            <PanelSectionRow key={device.mac_address}>
                <ButtonItem
                    layout="below"
                    onClick={() => handleClickDiscoveredDevice(device)}
                >
                    {device.nickname || device.ip_address} - {device.mac_address}
                </ButtonItem>
            </PanelSectionRow>
        );
    });

    return (
        <React.Fragment>
            <PanelSection title="Saved Devices">
                {renderSavedDevices}
            </PanelSection>
            <PanelSection title="Discovered Devices">
                {renderDiscoveredDevices}
            </PanelSection>
        </React.Fragment>
    )
}