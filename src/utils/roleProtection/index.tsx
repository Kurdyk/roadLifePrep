import React from 'react'
import { useCheckRole } from './hook'
import { RoleComponentProps } from './type';

const RoleProtectionComponent: React.FC<RoleComponentProps> = ({children, mapKey: key, role}) => {
    return <div className="roleProtection">{useCheckRole(key, role)? children : null}</div>;
}

export default RoleProtectionComponent