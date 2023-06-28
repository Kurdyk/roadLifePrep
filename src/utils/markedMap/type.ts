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
    startPosition : [number, number],
    endPosition : [number, number],
    color : string,
    id: number, 
};

export type MarkedMapComponentProps = {
    id: string
    markers? : MarkerInfo[],
    lines? : LinesInfo[],
    center : [number, number],
    canInteract : boolean,
    defaultZoom : number,
};