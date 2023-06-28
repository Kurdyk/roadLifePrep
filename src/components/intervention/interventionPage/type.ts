import { DialogComponentProps } from "utils/dialog/type";

export type Intervention = {
    interventionId : string,
    roadLocalisation  : string,
    askDate : Date,
    description : string,
    state : "Demandée" | "Refusée" | "En cours" | "Terminée",
    lastModification? : Date,
    report? : string,
    gain? : number,
    actions? : DialogComponentProps[],
    dateRefusal? : Date,
    dateSolved? : Date,
    dateValidation? : Date,
    refusalDescription?: string,
};