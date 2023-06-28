import React from 'react'
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ToggleButtonGroupProps } from './type';

const ToggleButtonGroupComponent: React.FC<ToggleButtonGroupProps> = ({id, toggleButtonPropsList, changeHandler, selectedValue}) => {

    return (
    <ToggleButtonGroup id={id} exclusive className="ToogleButtonGroup" onChange={changeHandler}>
        {
            toggleButtonPropsList.map(({id, buttonText, value}, ) => {
                return <ToggleButton className="ToggleButton" color='primary' key={id} value={value} selected={(value === selectedValue) ? true : false}>
                    {buttonText}
                </ToggleButton>
            })
        }
    </ToggleButtonGroup>
  )
}

export default ToggleButtonGroupComponent;