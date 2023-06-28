import { Box } from '@mui/material'
import AccueilComponent from 'components/accueil'
import AuthentificationComponent from 'components/authentification'
import LogOutComponent from 'components/logout'
import UsersComponent from 'components/users'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { accueilPath, authentificationPath, logoutPath, usersPath, roadsPath, sensorPath, interventionPath, newInterventionPath } from './const'
import RoadComponent from 'components/roads'
import SensorComponent from 'components/sensor'
import InterventionListComposant from 'components/intervention/interventionPage'
import NewInterventionForm from 'components/intervention/interventionForm'
import RoleProtectionComponent from 'utils/roleProtection'
import NoMatch from 'components/noMatch'

const AllRoutes: React.FC = () => {
  return (
    <Box id="routeBox">
        <Routes>
            <Route path={accueilPath} element={<AccueilComponent/>} />
            <Route path={authentificationPath} element={<AuthentificationComponent />} />
            <Route path={logoutPath} element={<LogOutComponent />} />
            <Route path={usersPath} element={<RoleProtectionComponent children={<UsersComponent />} key={'role'} role={'collectivite'} />} />
            <Route path={roadsPath} element={<RoadComponent />} /> 
            <Route path={sensorPath} element={<SensorComponent/>} />
            <Route path={interventionPath} element={<InterventionListComposant/>} />
            <Route path={newInterventionPath} element={<NewInterventionForm />}/>
            <Route path='*' element={<NoMatch/>} />
        </Routes>
    </Box>
  )
}

export default AllRoutes;