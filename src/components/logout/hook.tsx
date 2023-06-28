import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const useData = () => {

    const navigate = useNavigate();

    const useLoad = () => {
        return useEffect(() => {
            sessionStorage.clear();
            navigate("/accueil");
        }, [])
    }

    return useLoad;
};