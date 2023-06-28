import React from 'react'
import { BottomDivContentProps } from './type'
import { Box, Typography } from '@mui/material'
import SvgIcon from '@mui/material/SvgIcon';


const FooterContentComponent: React.FC<BottomDivContentProps> = ({text, icon}) => {
  return (
    <Box className="FooterContentWrapper">
        <Typography className="FooterContentText" variant='body1' color="white">
            {text}
        </Typography>
        <SvgIcon className="FooterContentIcon" component={icon} sx={{fontSize:"100px"}}/>
    </Box>
  )
}

export default FooterContentComponent;