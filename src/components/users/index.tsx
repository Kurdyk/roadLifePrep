import { Box } from '@mui/material'
import React from 'react'
import { useData } from './hook';
import SearchableDataGridComponent from 'utils/SearchableDataGrid';

const UsersComponent:React.FC = () => {

    const {columns, users} = useData();

    return (
        <Box id="UsersTableWrapper">
            <SearchableDataGridComponent columns={columns} rows={users} />
        </Box>
    )
    
    
}

export default UsersComponent;