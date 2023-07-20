import { useEffect, useState } from "react"
import { Sensor, SensorChartData, SensorChartDataType, SensorData, SensorPresentationInfo, TimeScale } from "./type";
import LineGraphComponent from "utils/LineGraph";
import BarGraphComponent from "utils/barGraph";
import { Box, Typography } from "@mui/material";
import { Params } from "react-router-dom";
import { colorWear } from "components/shared/const";
import { Position, RoadName } from "components/roads/type";
import { Bar } from "utils/barGraph/type";
import { Line } from "utils/LineGraph/type";

export const fetchData = (setDataMap: React.Dispatch<React.SetStateAction<Map<string, number[]>>>,
                         setPresentationInfo: React.Dispatch<React.SetStateAction<SensorPresentationInfo | undefined>>,
                         setPredictedDate: React.Dispatch<React.SetStateAction<string>>,
                         setUsageMap: React.Dispatch<React.SetStateAction<Map<string, number>>>,
                         setPredictedWearMap: React.Dispatch<React.SetStateAction<Map<string, number>>>,
                         sensorId:number) => {

    const url = `http://localhost:5555/sensors/${sensorId}`;
    const requestData = (async () => {
        const rawResponse = await fetch(url, {
            method: 'GET',
            headers:{
              'Content-type':'application/json', 
            }})
        
        if (rawResponse.status !== 200) {
            const error = await rawResponse.json()
            console.log(error["message"])
            window.location.replace("/roads"); 
            return;
        }
        
        const content = await rawResponse.json();
        // presentation data
        const sensor = content["sensor"] as Sensor;

        const roadUrl = `http://localhost:5555/roads/${sensor.roadId}`

        const requestRoadInfo = (async () => {
            const rawResponse = await fetch(roadUrl, {
                method: 'GET',
                headers:{
                  'Content-type':'application/json', 
                }})
            
            if (rawResponse.status !== 200) {
                const error = await rawResponse.json()
                console.log(error["message"])
                return;
            }


            const response = await rawResponse.json();
            return {
                roadName: response.road.name as RoadName,
                wearScore: response.road.wearScore as number,
                position: response.road.roadPosition as Position[],
            }

        })

        requestRoadInfo().then((roadInfo) => {
            const presentationData = {
                roadName : roadInfo?.roadName,
                sensorId : sensor.id,
                currentWear : roadInfo?.wearScore,
                roadCoordinates : roadInfo?.position,
                sensorCoordinates : sensor.position,
            } as SensorPresentationInfo;
            setPresentationInfo(presentationData);
        })

    
        // graph data
        const data = sensor["data"] as SensorData;

        console.log(data);
        return data;

    });

    requestData().then((data) => {
        if (data === undefined) {
            return
        }
        const dataMap = new Map<string, number[]>(); // (dataType, timeScale) => values
        for (const scaledData of data.factualData) {
            dataMap.set(scaledData.dataType+scaledData.dataScale, scaledData.scaledData);
        }
        setDataMap(dataMap);

        // predicted date
        const predictedDate = data.prediction;
        setPredictedDate(predictedDate);

        // predicted wear
        const wearMap = new Map<string, number>();
        const predictedWears = data.wearPrediction;
        wearMap.set("Années", predictedWears[0]);
        wearMap.set("Mois", predictedWears[1]);
        wearMap.set("Semaine", predictedWears[2]);
        wearMap.set("Jour", predictedWears[3]);
        setPredictedWearMap(wearMap);

        // prediceted usage
        const usageMap = new Map<string, number>();
        const predictedUsages = data.usagePrediction;
        usageMap.set("Années", predictedUsages[0]);
        usageMap.set("Mois", predictedUsages[1]);
        usageMap.set("Semaine", predictedUsages[2]);
        usageMap.set("Jour", predictedUsages[3]);
        setUsageMap(usageMap);
    })
    
}

export const useData = (params:Readonly<Params<string>>) => {

    // Init
    const sensorId = parseInt(params["sensorId"]!)
    const [timeScale, setTimeScale] = useState<TimeScale>("Jour");
    const [dataType, setDataType] = useState<SensorChartDataType>("Wear");
    const [chartData, setChartData] = useState<SensorChartData>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [presentationInfo, setPresentationInfo] = useState<SensorPresentationInfo>();
    const [dataMap, setDataMap] = useState<Map<string, number[]>>(new Map());
    const [predictedDate, setPredictedDate] = useState<string>("");
    const [predictedUsageMap, setPredictedUsageMap] = useState<Map<string, number>>(new Map());
    const [predictedWearMap, setPredictedWearMap] = useState<Map<string, number>>(new Map());
    const toogleButtons = [{id:1, value:"Wear", buttonText:"Wear"}, {id:2, value:"Usage", buttonText:"Usage"}]


    useEffect(() => {
        fetchData(setDataMap, setPresentationInfo, setPredictedDate, setPredictedUsageMap, setPredictedWearMap,sensorId);
        setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const changeHandler = () => {
        if (dataType === "Wear") {
            setDataType("Usage")
        } else {
            setDataType("Wear")
        }
    };

    useEffect(() => {
        const values = dataMap.get(dataType+timeScale);
        if (values === undefined) {
            return;
        }
        const len = values.length;
        setChartData([{
                name: dataType, 
                stroke: "#ff6714", 
                data: values.map((value:number, index:number) => { // set the values
                    return {
                        key: `${timeScale.at(0)}+${Math.abs(index-len)}`,
                        value: value,
                    }
                })}])
    }, [timeScale, dataType, dataMap])

    // diplay functions
    const displayGraph = () => {

        function formatDate(dateString: string): string {
            const date = new Date(dateString);
            
            // Extract day, month, and year from the date
            const day = date.getDate();
            const month = date.getMonth() + 1; // Months are zero-based, so we add 1
            const year = date.getFullYear();
            
            // Pad the day and month values with leading zeroes if necessary
            const formattedDay = day.toString().padStart(2, '0');
            const formattedMonth = month.toString().padStart(2, '0');
            
            // Return the formatted date string
            return `${formattedDay}/${formattedMonth}/${year}`;
        }
          

        if (dataType === "Wear") {

            const wearReferenceLine = {
                y: 70,
                label: `Usure critique atteinte au : ${formatDate(predictedDate)}`,
                stroke: "red",
                dashed: "5 5",
            } // show the threshold

            const predictionLine = {
                name: "Predicted wear",
                stroke: "green",
                data: [
                    {key: `${timeScale.at(0)}+0`, value: predictedWearMap.get(timeScale)}, 
                    {key: `${timeScale.at(0)}+1`, value: dataMap.get(dataType+timeScale)?.slice(-1)[0]}
                ],
                strokeDasharray: "1 3",
            } as Line;
            return <LineGraphComponent lines={[...chartData, predictionLine]} id={'WearGraph'} xLabel={"Temps"} yLabel={"Usure en %"} 
            referenceLines={[wearReferenceLine]}/>

        } else {
            const predictionBar = {
                name: "Predicted usage", 
                stroke: "green", 
                data: [{key: `${timeScale.at(0)}+0`,
                        value: predictedUsageMap.get(timeScale)}]
                } as Bar;
            return <BarGraphComponent bars={[...chartData, predictionBar]} id={"UsageGraph"} />
        }

    }

    const displayPresentation = () => {

        // a function that return a three letter string from a number
        const fillNumber = (n:number) => {
            const asString = String(n);
            return "0".repeat(3 - asString.length) + asString;
        }

        return (
            <Box id="SensorInfo">
                <Typography variant="h4" id="Adress">
                {presentationInfo?.roadName.streetName}<br/>
                {presentationInfo?.roadName.postalCode} {presentationInfo?.roadName.city}
                </Typography>
                <Typography variant="h6" className="SubInfo">{`CAP_${presentationInfo?.roadName.postalCode}_${fillNumber(sensorId)}`}</Typography>
                <Box className="WearPresentation">
                    <Typography variant="h6" className="SubInfo">
                        Taux d'usure actuel :
                    </Typography>
                    <Typography variant="h4" className="SubInfo" id={"WearInfo"} color={colorWear(presentationInfo?.currentWear!)}>
                        {`${presentationInfo?.currentWear}%`}
                    </Typography>
                </Box>
            </Box>
        )
    }

    

    return ({
        timeScale, 
        setTimeScale,
        setDataMap,
        dataType,
        setChartData,
        displayGraph,
        toogleButtons,
        changeHandler,
        setPresentationInfo,
        displayPresentation,
        presentationInfo,
        sensorId,
        isLoading,
    })
}