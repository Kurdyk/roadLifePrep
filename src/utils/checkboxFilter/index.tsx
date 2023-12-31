/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import { CheckboxFilterProps } from './type'
import { checkboxSelectionContext } from 'utils/SearchableDataGrid/const';
import CheckboxGroup from 'utils/atoms/checkboxGroup';

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({id, labels, values, index, onChange, title}) => {

    const {selections, setSelections} = useContext(checkboxSelectionContext);

    useEffect(() => {
        setSelections(index, new Set<any>());
    }, [])

    return (
        <Box className="CheckboxFilter" id={id}>
            <Typography variant='h6' className="CheckboxFilterTitle" color={"text.secondary"}>{title}</Typography>
            <CheckboxGroup labels={labels} onChange={(event, labelIndex) => {
                const current = selections.get(index)!;
                if (event.target.checked) {
                    current.add(values[labelIndex]);
                } else {
                    current.delete(values[labelIndex]);
                }
                setSelections(index, current);
                onChange?.apply(undefined)
            }}
            />
        </Box>
    )
}

export default CheckboxFilter