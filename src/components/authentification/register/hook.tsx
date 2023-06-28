import { accueilPath } from "components/shared/routes/const";
import jwtDecode from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionButtonProps } from "utils/atoms/buttonGroup/actionButtonGroup/type";
import { FormInputProps, InputGroupProps } from "utils/atoms/inputGroup/type";
import { Token } from "../type";

const url = "http://localhost:4444/register";

export const useData = () => {

    const [mail, setMail] = useState<string>();
    const [mailError, setMailError] = useState<boolean>(false);
    const [nom, setNom] = useState<string>();
    const [prenom, setPrenom] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [passwordError, setPasswordError] = useState<boolean>(false);

    const navigate = useNavigate();
    // Preparing data
    
    /// Action buttons
    const confirmAction = {
        id:1,
        buttonText:"Confirm",
        type:"submit",
        clickHandler: () => {

            setMailError(false);
            setPasswordError(false);
            
            const verifyPassword = () => {
                if (password === undefined) {
                    return false;
                }
                const minRegex = /[a-z]/g;
                const majRegex = /[A-Z]/g;
                const digitRegex = /[0-9]/g;
                const specialRegex = /[^a-zA-Z0-9]/g;
                const allRegex = [minRegex, majRegex, digitRegex, specialRegex]
                var isValid = true;
                allRegex.forEach((regex) => {
                    if (password.match(regex) === null) {
                        setPasswordError(true);
                        isValid = false;
                    }
                })
                return isValid;
            };
            if (!verifyPassword()) {
                return;
            }

            (async () => {

                const rawResponse = await fetch(url, {
                  method: 'POST',
                  headers:{
                    'Content-type':'application/json', 
                  },
                  body: JSON.stringify({
                    "prenom":prenom,
                    "nom":nom,
                    "mail":mail,
                    "password":password,
                  })
                });

                if (rawResponse.status !== 200) {
                    setMailError(true)
                    return
                }

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
    const prenomInput = {
        required:true,
        placeholder:"Prénom",
        onChange: (input:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setPrenom(input.target.value);
        },
    } as FormInputProps;

    const nomInput = {
        required:true,
        placeholder:"Nom",
        onChange: (input:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setNom(input.target.value);
        },
    } as FormInputProps;

    const mailInput = {
        required:true,
        placeholder:"Mail",
        onChange: (input:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setMail(input.target.value)
        },
        error:mailError,
        helperText:"Mail already in use",
    } as FormInputProps;

    const mpdInput = {
        required:true,
        placeholder:"Mot de passe avec au minimum une minuscule, une majuscule, un chiffre et un caractère spécial",
        onChange: (input:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setPassword(input.target.value);
        },
        type:"password",
        error:passwordError,
        helperText:"Your password isn't secure enough"
    } as FormInputProps;

    const inputGroupProps = {
        inputsPropsList: [prenomInput, nomInput, mailInput, mpdInput],
        inputLabel: "Register",
    } as InputGroupProps;

    // Building full data content
    const registerContent = {
        actionButtonGroupProps: actionGroupProps, 
        inputGroupProps: inputGroupProps,
    };

    return ({
        registerContent,
    });
} 

