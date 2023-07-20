import React from 'react'
import { CheckboxGroupProps } from './type'
import { Box, Checkbox, FormControlLabel } from '@mui/material'

const CheckboxGroup:React.FC<CheckboxGroupProps> = ({labels, onChange, id}) => {
  return (
    <Box id={id} className="CheckboxGroup" key={id}>
        {
            labels.map((label, index) => {
                return <FormControlLabel control={<Checkbox onChange={(event) => {
                    onChange?.apply(undefined, [event, index])
                }}/>} label={label} key={label}/>
            })
        }
    </Box>
  )
}

export default CheckboxGroup;