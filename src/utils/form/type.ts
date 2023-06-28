import { ToggleButtonGroupProps } from "utils/atoms/buttonGroup/toggleButtonGroup/type";
import { ActionButtonGroupProps } from "utils/atoms/buttonGroup/actionButtonGroup/type";
import { InputGroupProps } from "utils/atoms/inputGroup/type";


export type GenericFormComponentProps = {
    toggleButtonsGroupProps?: ToggleButtonGroupProps,
    actionButtonGroupProps?: ActionButtonGroupProps,
    inputGroupProps?: InputGroupProps,
    id? : string,
}