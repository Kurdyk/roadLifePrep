import { Autocomplete, Box, FormHelperText, Input, TextField} from "@mui/material"
import { FormInputProps } from "./type"

const displayError = (error:boolean|undefined, helperText:string|undefined) => {
    if (error === undefined) return
    if (error) {
        return <FormHelperText className='FormErrorHelperText'>{helperText}</FormHelperText>
    }
}

export const autocompleteOrInput = ({value, required, placeholder, onChange, type, error, helperText, autocompeInfo, multiline} : FormInputProps) => {
    if (autocompeInfo === undefined) return (
        <Box key={placeholder}>
            <Input className="Input" required={required} error={error} multiline={multiline}
            placeholder={placeholder} type={type} value={value} onChange={onChange} key={placeholder} />
            {
                displayError(error, helperText)
            }
        </Box>
    )
    return (
        <Box key={placeholder}>
            <Autocomplete className="Input" renderInput={(params) => <TextField {...params} label={placeholder} required={required}/>}
            freeSolo={false} groupBy={autocompeInfo.groupBy} getOptionLabel={autocompeInfo.getOptionLabel}
            disabledItemsFocusable = {true} renderGroup={autocompeInfo.renderGroup}
            placeholder={placeholder} value={value} onChange={onChange} key={placeholder} options={autocompeInfo.options}/>
            {
                displayError(error, helperText)
            }
        </Box>
    )
}