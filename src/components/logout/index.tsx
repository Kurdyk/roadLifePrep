import React from 'react'
import { useData } from './hook';

const LogOutComponent: React.FC = () => {

    const useLoad = useData();
    useLoad();

    return (
        <div>Logout in progress</div>
    )
}

export default LogOutComponent;