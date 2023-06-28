export type ToggleButtonProps = {
    id: number,
    buttonText: string,
    value: string,
};

export type ToggleButtonGroupProps = {
    id?: string,
    toggleButtonPropsList: ToggleButtonProps[],
    changeHandler: () => void,
    selectedValue: string,
};