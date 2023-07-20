import { RoadName } from "components/roads/type";
import { DialogComponentProps } from "utils/dialog/type";

export enum Status {
    Asked = 0,
    Refused = 1,
    Outgoing = 2,
    Solved = 3
}

export type Intervention = {
    id : string,
    roadName: RoadName,
    roadUrl: string,
    askDate : Date,
    description : string,
    state : Status,
    lastModification? : Date,
    report? : string,
    gain? : number,
    actions? : DialogComponentProps[],
    refusalDate? : Date,
    realisationDate? : Date,
    acceptanceDate? : Date,
    refusalDescription?: string,
};

