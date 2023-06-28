import { Box } from '@mui/material'
import React from 'react'
import GenericFormComponent from 'utils/form'
import { useData } from './hook'
import { registerFormProps } from './type'

const RegisterComponent: React.FC<registerFormProps> = ({registerDisplay, toggleButtonsGroupProps}) => {

    const {
        registerContent, 
    } = useData();

    const {actionButtonGroupProps, inputGroupProps} = registerContent;

    return (
        <Box id="RegisterWrapper" sx={{display:registerDisplay}}>
            <GenericFormComponent 
                toggleButtonsGroupProps={toggleButtonsGroupProps}
                actionButtonGroupProps={actionButtonGroupProps}
                inputGroupProps={inputGroupProps} />
        </Box>
  )
}

export default RegisterComponent