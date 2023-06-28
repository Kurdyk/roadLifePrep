export type Road = {
    roadId:number,
    street:string,
    postalCode: number,
    city: string,
    sensorsIdList: number[], 
    startPosition: [number, number],
    endPosition: [number, number],
};

export type DispayableRoad = {
    id:number,
    road:string,
    sensor:string,
    wear:number,
    usage: number,
}