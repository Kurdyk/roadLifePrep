import ToggleButtonGroupComponent from "utils/atoms/buttonGroup/toggleButtonGroup";
import { ToggleButtonGroupProps } from "utils/atoms/buttonGroup/toggleButtonGroup/type";

export const renderToogleButtons = (toggleButtonsGroupProps:ToggleButtonGroupProps | undefined) => {

    if (toggleButtonsGroupProps === undefined) {
        return <></>
    } else {
        const {toggleButtonPropsList, changeHandler, selectedValue} = toggleButtonsGroupProps!;
        return (
            <ToggleButtonGroupComponent 
                toggleButtonPropsList={toggleButtonPropsList} 
                changeHandler={changeHandler} 
                selectedValue={selectedValue}/>
        )
    }
    
}