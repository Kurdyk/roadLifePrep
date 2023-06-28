export type CheckboxGroupProps = {
    id? : string,
    labels : string[],
    onChange? : (event: React.ChangeEvent<HTMLInputElement>, labelIndex:number) => void,
}