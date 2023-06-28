import { ActionButtonProps } from "utils/atoms/buttonGroup/actionButtonGroup/type";

export type User = {
    prenom: string,
    nom: string,
    mail: string,
    role: string,
    action? : ActionButtonProps,
}