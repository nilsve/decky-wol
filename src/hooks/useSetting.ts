import {useCallback, useEffect, useState} from "react";
import {getSetting, saveSetting} from "../api";

export const useSetting = (setting: string) => {
    const [value, setValue] = useState<string | null>(null);

    useEffect(() => {
      getSetting(setting).then((setting) => {
        setValue(setting.value);
      });
    }, [setting]);

    const updateValue = useCallback(async (newValue: string) => {
        await saveSetting({
            name: setting,
            value: newValue
        });

        setValue(newValue);
    }, []);

    console.log("Setting", setting, value);

    return {
        value,
        updateValue
    };
}