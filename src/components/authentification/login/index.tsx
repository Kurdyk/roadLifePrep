import React from 'react'
import { useData } from './hook';
import { Box } from '@mui/material';
import GenericFormComponent from 'utils/form';
import { loginFormProps } from './type';

const LoginComponent: React.FC<loginFormProps> = ({loginDisplay, toggleButtonsGroupProps}) => {
    const {
        loginContent, 
    } = useData();

    const {actionButtonGroupProps, inputGroupProps} = loginContent;

    return (
        <Box id="LoginWrapper" sx={{display:loginDisplay}}>
            <GenericFormComponent 
                toggleButtonsGroupProps={toggleButtonsGroupProps}
                actionButtonGroupProps={actionButtonGroupProps}
                inputGroupProps={inputGroupProps} />
        </Box>
  )
}

export default LoginComponent