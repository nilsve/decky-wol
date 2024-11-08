import {SidebarNavigation} from "@decky/ui";
import {DevicesPage} from "../devices";

export const NavigationComponent = () => {
    const pages = [
        {
            title: "Add Devices",
            content: <DevicesPage />,
            hideTitle: false,
        },
    ];

    return <SidebarNavigation pages={pages} />;
}