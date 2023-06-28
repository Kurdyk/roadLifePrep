import { Box, Button } from '@mui/material';
import React from 'react'
import SearchableDataGridComponent from 'utils/SearchableDataGrid';
import { useData } from './hook';
import { useNavigate } from 'react-router-dom';

const InterventionListComposant: React.FC = () => {

    const {columns, interventions, isLoading} = useData()
    const navigate = useNavigate();

    return (
        <Box id="InterventionList">
            <Button variant={"outlined"} onClick={() => {navigate("/newIntervention")}}>Demander une intervention</Button>
            <SearchableDataGridComponent rows={interventions} columns={columns} id="InterventionGrid" loading={isLoading}/>
        </Box>
  )
}

export default InterventionListComposant;