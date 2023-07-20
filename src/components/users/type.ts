import { ActionButtonProps } from "utils/atoms/buttonGroup/actionButtonGroup/type";

export type User = {
    id: string,
    prenom: string,
    nom: string,
    mail: string,
    role: string,
    actions? : ActionButtonProps[],
}