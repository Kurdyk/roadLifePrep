export type Position = [number, number]

export type RoadName = {
    city:string,
    postalCode:string, 
    streetName:string
}

export type Road = {
    id:string,
    name: RoadName,
    wearScore: number,
    roadPosition: Position[],
};

export type DispayableRoad = {
    id:number,
    road:string,
    sensor:string,
    wear:number,
    usage: number,
}