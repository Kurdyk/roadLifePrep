import React from 'react'
import { Box, Button,  } from '@mui/material';
import { ActionButtonGroupProps } from './type';

const ActionButtonGroupComponent: React.FC<ActionButtonGroupProps> = ({actionButtonPropsList}) => {

    return (
    <Box className="ActionButtonGroup">
        {
            actionButtonPropsList.map(({id, buttonText, value, clickHandler}, ) => {
                return <Button variant="outlined" className="ActionButton" color='primary' 
                        key={id} value={value} onClick={clickHandler}>
                    {buttonText}
                </Button>
            })
        }
    </Box>
  )
}

export default ActionButtonGroupComponent;