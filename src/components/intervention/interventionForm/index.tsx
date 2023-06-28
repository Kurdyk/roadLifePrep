import { Box, CircularProgress } from '@mui/material'
import React from 'react'
import GenericFormComponent from 'utils/form'
import { useData } from './hook'

const NewInterventionForm: React.FC = () => {

    const {formContent, publishButton, isLoading, } = useData();

    if (isLoading) {
        return <CircularProgress />
    }
    
    return (
        
        <Box id="NewInterventionFormWrapper">
            <GenericFormComponent id="InterventionForm"
                inputGroupProps={formContent}
                actionButtonGroupProps={{actionButtonPropsList:[publishButton]}} />
        </Box>
  )
}

export default NewInterventionForm