import { Box, Button, IconButton } from "@mui/material";
import { RouteInfo } from "../routes/type";
import { useNavigate } from "react-router-dom";
import GitHubIcon from '@mui/icons-material/GitHub';

export const useRenderNavOptions = (listRoutes:RouteInfo[]) => {

    const navigate = useNavigate();

    return (
    <Box id="NavBarButtonWrapper">
        {listRoutes.map(({path, linkName, requiredLogin, requiredRole}) => {
            if (requiredLogin !== undefined) {
                if (requiredLogin && sessionStorage.getItem("token") === null) {
                    return null
                }
                if (!requiredLogin && sessionStorage.getItem("token") !==null) {
                    return null
                }
            }
            if (requiredRole !== undefined) {
                if (sessionStorage.getItem(requiredRole.key) !== requiredRole.role) {
                    return null
                }
            }
            return <Button onClick={() => {navigate(path)}} color="info" key={path}>{linkName}</Button>
        })}
        <IconButton children={<GitHubIcon/>} key={"toGitHub"}/>
    </Box>)
}