import { ReactElement, ReactNode } from "react";
import { ComponentChoice } from "utils/atoms/doubleLabelSwitch/type";

export type SwitchableComponentProps = {
    components: [SwitchOptionComponent, SwitchOptionComponent],
    defaultComponent: ComponentChoice,
}

export type SwitchOptionComponent = {
    element: ReactElement | ReactNode,
    label: string,
}