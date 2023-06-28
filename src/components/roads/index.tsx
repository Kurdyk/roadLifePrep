import React from 'react'
import SwitchableComponent from 'utils/switchableComponent'
import { useData } from './hook'
import SearchableDataGridComponent from 'utils/SearchableDataGrid'
import { Box } from '@mui/material'
import MarkedMapComponent from 'utils/markedMap'

const RoadComponent: React.FC = () => {

    const {columns, gridDisplayableRoads, visualRoads, visualSensors} = useData();

    return (
        <Box id="SwitchableRoadDisplay">
            <SwitchableComponent
                components={[
                    {element:<SearchableDataGridComponent rows={gridDisplayableRoads} columns={columns} id={"RoadGrid"}/>, label:"Liste"},
                    {element: <MarkedMapComponent center={[48.866, 2.333]} canInteract={true} defaultZoom={15} 
                        id={'RoadsMap'} markers={visualSensors} lines={visualRoads}/>, label:"Carte"}]} 
                defaultComponent={0} 
            />
        </Box>
    )
}

export default RoadComponent;