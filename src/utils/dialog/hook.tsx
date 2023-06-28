import { Button, IconButton } from "@mui/material";
import { ReactNode, useState } from "react";

export const useData = () => {
    const [open, setOpen] = useState<boolean>(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const renderOpener = (dialogOpener: string | ReactNode) => {
        if (typeof dialogOpener === "string") {
            return (
                <Button variant="outlined" onClick={handleClickOpen}>
                    {dialogOpener}
                </Button>
            )
        } else {
            return (
                <IconButton children={dialogOpener} onClick={handleClickOpen}/>
            )
        }
    }

    return {
        open,
        renderOpener,
        handleClose,
    }
}