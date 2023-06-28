import { Box, Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import { DateRangePickerProps } from './type'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/fr';
import { datesRangeContext } from 'utils/SearchableDataGrid/const';


const DateRangePicker: React.FC<DateRangePickerProps> = ({id, index, startDateLabel, endDateLabel, onChange, title}) => {

    const {dates, setDates} = useContext(datesRangeContext);

    useEffect(() => {
        setDates(index, {startDate:null, endDate:null})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Box id={id} className="DateRangePicker" key={index}>
            <Typography variant='h6'>{title}</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                <DatePicker className="DatePicker"
                            label={startDateLabel}
                            onChange={(newValue:Date | null) => {
                                console.log(newValue);
                                setDates(index, {startDate: newValue, endDate:dates.get(index)!.endDate});
                                onChange?.apply(undefined, [])
                            }}
                            key={0} />
                <DatePicker className="DatePicker"
                            label={endDateLabel} 
                            onChange={(newValue: Date | null) => {
                                console.log(newValue);
                                dates.set(index, {startDate: dates.get(index)!.startDate, endDate:newValue});
                                onChange?.apply(undefined, [])
                            }}
                            key={1} />
            </LocalizationProvider>
        </Box>
    )
}

export default DateRangePicker