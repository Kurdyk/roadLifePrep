export type CheckboxFilterProps = {
    id? : string,
    index : number, // index in the col list
    labels : string[], // displayed info    
    values: any[], // values behind the displayed info
    onChange? : () => void,
    title? : string;
}