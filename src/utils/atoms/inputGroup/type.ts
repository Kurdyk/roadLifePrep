import { AutocompleteRenderGroupParams } from "@mui/material";
import { ReactNode } from "react";

export type AutocompleteInfo = {
    options : string[]; // for autocomplete fields
    groupBy : (option: any) => string, // for autocompletion groups
    getOptionLabel : (option: any) => string, // what to display
    renderGroup : (params:AutocompleteRenderGroupParams) => ReactNode,
}

export type FormInputProps = {
    value?: string, // default value
    type?: string,  // Type of the input eg. password
    error?: boolean, // set the error display if true
    helperText?: string, // Helper in case of error
    required: boolean, // require the field or not
    multiline? : boolean,
    placeholder: string,
    onChange?: (input:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any, value?: any) => void, // function to execute on each change
    autocompeInfo? : AutocompleteInfo,
}

export type InputGroupProps = {
    inputsPropsList: FormInputProps[],
    inputLabel: string,
}