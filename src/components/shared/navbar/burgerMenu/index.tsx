import React from 'react'
import {slide as Menu} from "react-burger-menu";
import { NavBarProps } from '../type';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { computeDisplay } from './hook';

const BurgerMenuComponent: React.FC<NavBarProps> = ({listRoutes}) => {
    const navigate = useNavigate();
    return (
        <Menu right>
            {listRoutes.map(({path, linkName, requiredLogin, requiredRole}) => {
                    return <Button id={"button_" + path.substring(1)} variant="outlined" 
                        color="primary" key={path} onClick={() => { navigate(path);}}
                        className="NavButton" sx={{display:computeDisplay(requiredLogin, requiredRole)}}>{linkName}</Button>
                })}
        </Menu>
    );
}

export default BurgerMenuComponent