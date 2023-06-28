export type ActionButtonProps = {
    id: number,
    buttonText: string,
    value?: any,
    clickHandler: () => void,
};

export type ActionButtonGroupProps = {
    actionButtonPropsList: ActionButtonProps[],
};