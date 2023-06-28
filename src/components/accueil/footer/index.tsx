import { Box } from '@mui/material'
import React from 'react'

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import FooterContentComponent from './content';

const FooterComponent: React.FC = () => {
  return (
    <Box id="footerAccueil">
        <FooterContentComponent text={"Plus de 30 collectivités françaises ont adopté Road Life"}
            icon={PersonOutlineOutlinedIcon}/>
        <FooterContentComponent text={"100% des routes que nous monitorons ne dépassent pas les 70% d'usure"} 
            icon={SpeedOutlinedIcon}/>
        <FooterContentComponent text={"Préparez des interventions dès la reception d'alerte sur le taux d'usure de vos routes"}
            icon={HistoryOutlinedIcon}/>

    </Box>
  )
}

export default FooterComponent