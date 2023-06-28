export type ScaleSelectorComponentProps = {
    value: string
    valueDispatcher: React.Dispatch<React.SetStateAction<string>>,
    authorizedValues: string[],
    id: string, 
    label: string,
    onChange?: () => void;
}