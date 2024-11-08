import {Device} from "../../../../models";
import React, {ChangeEventHandler, useCallback} from "react";
import {
    DialogButton,
    DialogButtonPrimary,
    DialogButtonSecondary,
    DialogHeader,
    Field,
    Focusable,
    ModalRoot,
    TextField
} from "@decky/ui";

interface Props {
    device: Device;
    onSave: (device: Device) => void;
    onDelete?: (device: Device) => void;
    closeModal?: () => void;
}

export const UpdateDeviceModal: React.FC<Props> = ({device, onSave, onDelete, closeModal}) => {
    const [nickname, setNickname] = React.useState(device.nickname);

    const handleSaveClick = useCallback(() => {
        onSave({
            ...device,
            nickname
        });
        closeModal?.();
    }, [device, closeModal, nickname]);

    const handleDeleteClick = useCallback(() => {
        onDelete?.(device);
        closeModal?.();
    }, [device, closeModal, onDelete]);

    const handleUpdateNickname: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
        setNickname(e.target.value);
    }, [setNickname]);

    return (
        <ModalRoot onCancel={closeModal}>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <DialogHeader>Add Device</DialogHeader>
                <Field
                    label="Nickname"
                    padding="none"
                    bottomSeparator="none"
                >
                    <Focusable
                        style={{ boxShadow: "none", display: "flex", justifyContent: "right", padding: "5px 0" }}
                    >
                        <TextField
                            style={{ padding: "10px", fontSize: "14px", width: "435px" }}
                            value={nickname}
                            onChange={handleUpdateNickname}
                        />
                    </Focusable>
                </Field>

                <Focusable style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <DialogButtonPrimary
                        onClick={handleSaveClick}
                        style={{ alignSelf: "center", marginTop: "20px", fontSize: "14px", textAlign: "center", width: "200px" }}
                    >
                        Save
                    </DialogButtonPrimary>
                    {
                        onDelete && (
                            <DialogButtonSecondary
                                onClick={handleDeleteClick}
                                style={{ alignSelf: "center", marginTop: "20px", fontSize: "14px", textAlign: "center", width: "200px" }}
                            >
                                Delete
                            </DialogButtonSecondary>
                        )
                    }
                    <DialogButton
                        onClick={closeModal}
                        style={{ alignSelf: "center", marginTop: "20px", fontSize: "14px", textAlign: "center", width: "200px" }}
                    >
                        Cancel
                    </DialogButton>
                </Focusable>
            </div>
        </ModalRoot>
    )
}