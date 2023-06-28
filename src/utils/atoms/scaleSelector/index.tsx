import React from 'react'
import { ScaleSelectorComponentProps } from './type'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useData } from './hook';

const ScaleSelectorComponent: React.FC<ScaleSelectorComponentProps> = ({value, authorizedValues, id, valueDispatcher, label, onChange}) => {

    const changeHandler = useData(valueDispatcher, onChange);

    return (
        <FormControl className='ScaleSelectorWrapper' id={id}>
            <InputLabel className="ScaleSelectorInputLabel">{label}</InputLabel>
            <Select className="ScaleSelector" onChange={changeHandler} label={label} value={value}>
                {
                    authorizedValues.map((value, index) => {
                        return <MenuItem value={value} key={index}>{value}</MenuItem> // the index should be constant
                    })
                }
            </Select>
        </FormControl>
  )
}

export default ScaleSelectorComponent