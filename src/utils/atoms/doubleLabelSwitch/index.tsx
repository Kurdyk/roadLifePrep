import { Box, Typography, Switch } from '@mui/material'
import React from 'react'
import { DoubleLabelSwitchComponentProps } from './type'
import { useData } from './hook'

const DoubleLabelSwitchComponent: React.FC<DoubleLabelSwitchComponentProps> = ({labels, state, stateDispatcher})  => {

    const changeHandler = useData(stateDispatcher);

    return (
        <Box className="DoubleLabelSwitch">
            <Typography className="DoubleSwitchLabel" variant="h4" color={"text.secondary"}>{labels[0]}</Typography>
            <Switch 
                defaultChecked={state === 1} 
                onChange={() => {changeHandler(state);}}
            />
            <Typography className="DoubleSwitchLabel" variant="h4" color={"text.secondary"}>{labels[1]}</Typography>
        </Box>
  )
}

export default DoubleLabelSwitchComponent