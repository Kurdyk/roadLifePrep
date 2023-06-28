import { Line } from "utils/LineGraph/type";
import { Bar } from "utils/barGraph/type";

export type Sensor = {
    sensorId: string,
    currentWear: number, // usure
    currentUsage: number,
    position: [number, number],
}

export type SensorPresentationInfo = {
    roadName : string,
    postalCode : number,
    sensorId : number,
    currentWear : number,
    city : string,
    roadCoordinates : [[number, number], [number, number]],
    sensorCoordinates : [number, number],
}

export type TimeScale = "Années" | "Mois" | "Semaine" | "Jour";
export type SensorChartDataType = "Wear" | "Usage";
export type SensorChartData = Line[] | Bar[] ;