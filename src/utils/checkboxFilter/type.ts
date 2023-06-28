export type CheckboxFilterProps = {
    id? : string,
    index : number, // index in the col list
    labels : string[],
    onChange? : () => void,
    title? : string;
}