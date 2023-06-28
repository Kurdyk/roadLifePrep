import { accueilPath } from "components/shared/routes/const";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

export const useCheckLogin = () => {

    const navigate = useNavigate();
    const logged = sessionStorage.getItem("token") !== null;

    useEffect(() => {
    if (!logged) {
        navigate("/");
        navigate(accueilPath);
    }})
    return logged;
}