import BurgerMenuComponent from './burgerMenu'
import { useRenderNavOptions } from './hook'
import { NavBarProps } from './type'
import { Box } from '@mui/material'

const NavBar:React.FC<NavBarProps> = ({listRoutes}) => {
    
  return (
    <Box id="NavBarWrapper" sx={{backgroundColor:"secondary.main"}}>
       {useRenderNavOptions(listRoutes)}
       <Box id="BurgerWrapper">
            <BurgerMenuComponent listRoutes={listRoutes} />
        </Box>
    </Box>
  ) 
}

export default NavBar