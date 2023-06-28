import React from 'react'
import { useCheckLogin } from './hook'
import { LoginComponentProps } from './type';

const LoginProtectionComponent: React.FC<LoginComponentProps> = ({children}) => {
    return <div className="loginProtection">{useCheckLogin()? children : null}</div>;
}

export default LoginProtectionComponent