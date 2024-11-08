import {
    ButtonItem,
    PanelSection,
    PanelSectionRow,
    Navigation,
    staticClasses
} from "@decky/ui";
import {
    addEventListener,
    removeEventListener,
    definePlugin,
    toaster,
    routerHook
} from "@decky/api"
import {FaShip} from "react-icons/fa";
import {useStoredDevices} from "./hooks/useStoredDevices";
import {wakeDevice} from "./api";
import {SettingsPage} from "./pages/settings";
import React from "react";
import {Device} from "./models";

const Content: React.FC = () => {
    const {
        devices
    } = useStoredDevices();

    console.log("Devices", devices);

    const onClick = async (device: Device) => {
        await wakeDevice(device.mac_address);
    };

    const renderedDevices = devices.map((device) => {
        return (
            <PanelSectionRow key={device.mac_address}>
                <ButtonItem
                    layout="below"
                    onClick={() => onClick(device)}
                >
                    {device.nickname}
                </ButtonItem>
            </PanelSectionRow>
        );
    });

    return (
        <React.Fragment>
            <PanelSection title="Devices">
                {renderedDevices}
            </PanelSection>
            <PanelSection title="Settings">
                <PanelSectionRow>
                    <ButtonItem
                        layout="below"
                        onClick={() => {
                            Navigation.Navigate("/decky-wol/settings");
                            Navigation.CloseSideMenus();
                        }}
                    >
                        Add Devices
                    </ButtonItem>
                </PanelSectionRow>
            </PanelSection>
        </React.Fragment>
    );
};

export default definePlugin(() => {
    console.log("Template plugin initializing, this is called once on frontend startup")

    routerHook.addRoute("/decky-wol/settings", SettingsPage, {
        exact: true,
    });

    // Add an event listener to the "timer_event" event from the backend
    const listener = addEventListener<[
        test1: string,
        test2: boolean,
        test3: number
    ]>("timer_event", (test1, test2, test3) => {
        console.log("Template got timer_event with:", test1, test2, test3)
        toaster.toast({
            title: "template got timer_event",
            body: `${test1}, ${test2}, ${test3}`
        });
    });

    return {
        // The name shown in various decky menus
        name: "WOL",
        // The element displayed at the top of your plugin's menu
        titleView: <div className={staticClasses.Title}>Wake on Lan</div>,
        // The content of your plugin's menu
        content: <Content/>,
        // The icon displayed in the plugin list
        icon: <FaShip/>,
        // The function triggered when your plugin unloads
        onDismount() {
            console.log("Unloading")
            removeEventListener("timer_event", listener);
            routerHook.removeRoute("/decky-wol/settings");
        },
    };
});
