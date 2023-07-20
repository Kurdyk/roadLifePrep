import { Position } from "components/roads/type";
import { Icon } from "leaflet"

export type MarkerInfo = {
    position : [number, number],
    text : string,
    link? : string,
    icon? : Icon,
    id : number,
    interactive : boolean,
};

export type LinesInfo = {
    position: Position[],
    color : string,
    id: number | string, 
};

export type MarkedMapComponentProps = {
    id: string
    markers? : MarkerInfo[],
    lines? : LinesInfo[],
    center : [number, number],
    canInteract : boolean,
    defaultZoom : number,
};