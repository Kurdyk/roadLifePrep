import { Box, Typography } from '@mui/material'
import React from 'react'
import AccueilMapComponent from './accueilMap'
import FooterComponent from './footer'

const AccueilComponent: React.FC = () => {   

  return (
    <Box id="AccueilWrapper">
        <Box id="AccueilMapAndTitleWrapper">
            <Box id="AccueilMapWrapper">
                <Box id="ColorFilter">
                    <AccueilMapComponent />
                </Box>
            </Box>
            <Box id="AccueilTextWrapper">
                <Typography className="AccueilTitle" variant='h6' color="black"> Mieux vaut prévenir que guérir</Typography>
                <Typography className="AccueilTitle" variant='h1' color="black">Road life</Typography>
            </Box>
        </Box>
        <FooterComponent />
    </Box>
  )
}

export default AccueilComponent;