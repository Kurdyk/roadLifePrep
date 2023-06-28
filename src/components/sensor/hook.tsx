import { useEffect, useState } from "react"
import { SensorChartData, SensorChartDataType, SensorPresentationInfo, TimeScale } from "./type";
import LineGraphComponent from "utils/LineGraph";
import BarGraphComponent from "utils/barGraph";
import { Box, Typography } from "@mui/material";
import { Params } from "react-router-dom";
import { colorWear } from "components/shared/const";

export const fetchData = (timeScale:TimeScale, sensorId:number,
                         dataType:SensorChartDataType, 
                         setChartData:React.Dispatch<React.SetStateAction<SensorChartData>>,
                         setPresentationInfo: React.Dispatch<React.SetStateAction<SensorPresentationInfo | undefined>>) => {

    const url = `http://localhost:5555/sensor/${sensorId}/${dataType}/${timeScale}`;
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
        const presentationData = content["sensorInfo"] as SensorPresentationInfo;
        setPresentationInfo(presentationData);

        // graph data
        const data = content["content"];
        return data;
    });

    requestData().then((data) => {
        const len = [...data].length; // .lenght doesn't directly work for some reason
        switch (timeScale) {
            case "Jour" as TimeScale:
                setChartData([{name:dataType, stroke:"#ff6714", 
                data:data.map((value:number, index:number) => { // set the values
                    return {
                        key: `J-${Math.abs(index-len)}`,
                        value: value,
                    }
                })}])
                break;
            case "Semaine" as TimeScale:
                setChartData([{name:dataType, stroke:"#ff6714", 
                data:data.map((value:number, index:number) => { // set the values
                    return {
                        key: `S-${Math.abs(index-len)}`,
                        value: value,
                    }
                })}])
                break;
            case "Mois" as TimeScale:
                setChartData([{name:dataType, stroke:"#ff6714", 
                data:data.map((value:number, index:number) => { // set the values
                    return {
                        key: `M-${Math.abs(index-len)}`,
                        value: value,
                    }
                })}])
                break;
            case "Années" as TimeScale:
                setChartData([{name:dataType, stroke:"#ff6714", 
                data:data.map((value:number, index:number) => { // set the values
                    return {
                        key: `A-${Math.abs(index-len)}`,
                        value: value,
                    }
                })}])
                break;
        }
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
    const toogleButtons = [{id:1, value:"Wear", buttonText:"Wear"}, {id:2, value:"Usage", buttonText:"Usage"}]

    const changeHandler = () => {
        if (dataType === "Wear") {
            setDataType("Usage")
        } else {
            setDataType("Wear")
        }
    };

    // diplay functions
    const displayGraph = () => {
        if (dataType === "Wear") {
            return <LineGraphComponent lines={chartData} id={'WearGraph'} xLabel={"Temps"} yLabel={"Usure en %"} />
        } else {
            return <BarGraphComponent bars={chartData} id={"UsageGraph"} />
        }
    }

    const displayPresentation = () => {

        const fillNumber = (n:number) => {
            const asString = String(n);
            return "0".repeat(3 - asString.length) + asString;
        }

        return (
            <Box id="SensorInfo">
                <Typography variant="h4" id="Adress">
                {presentationInfo?.roadName}<br/>
                {presentationInfo?.postalCode} {presentationInfo?.city}
                </Typography>
                <Typography variant="h6" className="SubInfo">{`CAP_${presentationInfo?.postalCode}_${fillNumber(sensorId)}`}</Typography>
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

    useEffect(() => {
        fetchData(timeScale, sensorId, dataType, setChartData, setPresentationInfo);
        setIsLoading(false);
    }, [timeScale, dataType, setChartData, setPresentationInfo, sensorId])

    return ({
        timeScale, 
        setTimeScale,
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