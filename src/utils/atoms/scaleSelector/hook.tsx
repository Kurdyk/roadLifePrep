import { SelectChangeEvent } from "@mui/material";

export const useData = (valueDispacter:React.Dispatch<React.SetStateAction<string>>, onChange:(() => void) | undefined) => {
    const changeHandler = (event: SelectChangeEvent) => {
        valueDispacter.apply(undefined, [event.target.value as string]);
        onChange?.apply(undefined);
    } 

    return changeHandler;
}