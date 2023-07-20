import { Position, RoadName } from "components/roads/type";
import { Line } from "utils/LineGraph/type";
import { Bar } from "utils/barGraph/type";

export type SensorData = {
    factualData: {
        scaledData: number[],
        dataType: "Wear" | "Usage",
        dataScale: "Années" | "Mois" | "Semaine" | "Jour",
    }[],
    prediction: string,
    usagePrediction: [number, number, number, number],
    wearPrediction: [number, number, number, number],
}

export type Sensor = {
    id: string,
    roadId: string,
    position: Position,
    data? : SensorData
}

export type SensorPresentationInfo = {
    roadName : RoadName,
    sensorId : string,
    currentWear : number,
    roadCoordinates : Position[],
    sensorCoordinates : Position,
}

export type TimeScale = "Années" | "Mois" | "Semaine" | "Jour";
export type SensorChartDataType = "Wear" | "Usage";
export type SensorChartData = Line[] | Bar[] ;