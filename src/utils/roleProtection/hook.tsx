import { accueilPath } from "components/shared/routes/const";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

export const useCheckRole = (key:string, role:string) => {

    const navigate = useNavigate();
    const authorized = sessionStorage.getItem(key) === role;

    useEffect(() => {
    if (!authorized) {
        navigate("/");
        navigate(accueilPath);
    }})
    return authorized;
}