import { accueilPath } from "components/shared/routes/const";
import jwtDecode from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionButtonProps } from "utils/atoms/buttonGroup/actionButtonGroup/type";
import { FormInputProps, InputGroupProps } from "utils/atoms/inputGroup/type";
import { Token } from "../type";

const url = "http://localhost:4444/login";  // Put url to login route of the authentification server

export const useData = () => {

    const navigate = useNavigate();

    const [mailError, setMailError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [mail, setMail] = useState<string>();
    const [password, setPassword] = useState<string>();

    // Preparing data

    /// Action buttons
    const confirmAction = {
        id:1,
        buttonText:"LogIn",
        type:"submit",
        clickHandler: () => {
            setMailError(false);
            setPasswordError(false);
            (async () => {


                const rawResponse = await fetch(url, {
                    method: 'POST',
                    headers:{
                        'Content-type':'application/json', 
                    },
                    body: JSON.stringify({
                            "mail":mail,
                            "password":password,
                    })
                });

                if (rawResponse.status === 401) {
                    setPasswordError(true);
                    return
                }

                if (rawResponse.status === 404) {
                    setMailError(true);
                    return
                }
                
                // success
                const content = await rawResponse.json();
                const decoded = jwtDecode<Token>(content["token"])
                sessionStorage.setItem("token", content["token"]);
                sessionStorage.setItem("role", decoded["role"]);
                navigate(accueilPath);

              })();
        },
    } as ActionButtonProps;

    const actionGroupProps = {
        actionButtonPropsList: [confirmAction]
    }

    /// Input 
    const mailInput = {
        required:true,
        placeholder:"Mail",
        onChange: (input:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setMail(input.target.value)
        },
        error:mailError,
        helperText:"Unregisterd user",
    } as FormInputProps;

    const mpdInput = {
        required:true,
        placeholder:"Mot de passe",
        onChange: (input:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setPassword(input.target.value);
        },
        type:"password",
        error:passwordError,
        helperText:"Invalid password"
    } as FormInputProps;

    const inputGroupProps = {
        inputsPropsList: [mailInput, mpdInput],
        inputLabel: "LogIn",
    } as InputGroupProps;

    // Building full data content
    const loginContent = {
        actionButtonGroupProps: actionGroupProps, 
        inputGroupProps: inputGroupProps,
    };

    return ({
        loginContent,
    })
} 

