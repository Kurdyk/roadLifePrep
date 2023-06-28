import React from 'react'
import LoginComponent from './login'
import RegisterComponent from './register'
import { Box } from '@mui/material'
import { useData } from './hook'

const AuthentificationComponent: React.FC = () => {

    const {formContent,
        loginDisplay, 
        registerDisplay,} = useData();

    const {toggleButtonsGroupProps} = formContent;

    return (
        <Box id="AuthentificationPageWrapper">
            <Box id="AuthentificationForm">
                <LoginComponent loginDisplay={loginDisplay} toggleButtonsGroupProps={toggleButtonsGroupProps!}/>
                <RegisterComponent registerDisplay={registerDisplay} toggleButtonsGroupProps={toggleButtonsGroupProps!} />
            </Box>
        </Box>
  )
}

export default AuthentificationComponent