import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'
import { DialogComponentProps } from './type'
import { useData } from "./hook"

const DialogComponent: React.FC<DialogComponentProps> = ({children, text, title, dialogButtons, dialogOpener}) => {

    const {open, renderOpener, handleClose} = useData();

    return (
        <Box className="Dialog">
            {renderOpener(dialogOpener)}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    {text}
                    </DialogContentText>
                    {children}
                </DialogContent>
                <DialogActions>
                    {dialogButtons?.map(({text, onClick}) => {
                        return <Button onClick={onClick} key="text">{text}</Button>
                    })}
                </DialogActions>
            </Dialog>
      </Box>
    )
}

export default DialogComponent;