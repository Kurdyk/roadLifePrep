import { CurveType } from "recharts/types/shape/Curve"

export type Line = {
    name: string,
    stroke : string,
    data: {key:string, value:number}[]
    type?: CurveType,
}

export type ReferenceLine = {
    x? : string,
    y? : number,
    stroke: string,
    label: string,
    dashed? : string | number,
}

export type LineGraphComponenentProps = {
    lines: Line[],
    referenceLines? : ReferenceLine[], 
    id : string,
    xLabel : string,
    yLabel : string,
} 