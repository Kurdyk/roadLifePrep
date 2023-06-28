export type DoubleLabelSwitchComponentProps = {
    labels: [string, string],
    state: ComponentChoice,
    stateDispatcher: React.Dispatch<React.SetStateAction<ComponentChoice>>
};

export type ComponentChoice = 0 | 1;