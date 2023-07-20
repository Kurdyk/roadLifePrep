export type Bar = {
    name: string,
    stroke : string,
    data: {key:string, value:number}[]
}

export type ReferenceLine = {
    x? : number,
    y? : number,
    stroke: string,
    label: string,
    dashed? : string | number,
}

export type BarGraphComponenentProps = {
    bars: Bar[],
    referenceLines? : ReferenceLine[], 
    id : string,
} 