import { CurveType } from "recharts/types/shape/Curve"

export type Line = {
    name: string,
    stroke : string,
    data: {key:string, value:number}[]
    type?: CurveType,
    strokeDasharray?: string,
}

export type ReferenceLine = {
    x? : number,
    y? : number,
    stroke: string, // color
    label: string, // legend
    dashed? : string | number,
}

export type LineGraphComponenentProps = {
    lines: Line[],
    referenceLines? : ReferenceLine[], 
    id : string,
    xLabel : string,
    yLabel : string,
} 