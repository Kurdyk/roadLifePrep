import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { DispayableRoad, Road } from "./type";
import { Sensor } from "components/sensor/type";
import { LinesInfo, MarkerInfo } from "utils/markedMap/type";
import { greenIcon } from "components/accueil/accueilMap/const";
import { IconButton, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom";
import { colorWear } from "components/shared/const";

const roadsUrl = "http://localhost:5555/roads";
const sensorsUrl = "http://localhost:5555/sensors";

// utils
const castToRowData = (roadString:string) => {
    const replaceRegex = /| |"/g;
    const filtered = roadString.replaceAll(replaceRegex, "");
    const roadObject = JSON.parse(filtered);
    return roadObject;
}

const castAll = (rawData:string[]) => {
    return rawData.map((objectString, index) => {
        const asObject = castToRowData(objectString);
        asObject["id"] = index;
        return asObject;
    })
}

// utils for table
const join = (sensors:Sensor[], roads:Road[]):DispayableRoad[] => {

    const fillNumber = (n:number) => {
        const asString = String(n);
        return "0".repeat(3 - asString.length) + asString;
    }

    const result = Array<DispayableRoad>();
    var id = 0;
    roads.forEach(({street, postalCode, city, sensorsIdList, roadId}) => {
        var cmpt = 0;
        sensors.forEach(({currentWear, sensorId}) => {
            if (sensorsIdList.includes(parseInt(sensorId))) {
                result.push({
                    road: `${street}\n${postalCode} ${city}`,
                    id:id++,
                    sensor: `CAP_${postalCode}_${fillNumber(++cmpt)}`,
                    wear:currentWear,
                    usage:0,
                } as DispayableRoad) 
            }      
        })
    })
    return result;
}

// utils for map
const toDisplayableMarkers = (sensors:Sensor[]):MarkerInfo[] => {
    return sensors.map(({position, sensorId}, index) => {
        return {position: position,
            text:`CAP_75008_${sensorId}`,
            link:`/sensor/${sensorId}`,
            icon: greenIcon,
            id:index,
            interactive:true}
    });
}

const toDisplayableRoads = (roads:Road[]):LinesInfo[] => {
    return roads.map(({startPosition, endPosition, roadId}) => {
        return {startPosition : startPosition,
            endPosition : endPosition,
            color : "red",
            id: roadId,
    }})
}

// UseData
export const useData = () => {

    const navigate = useNavigate();

    // Columns
    const columns = [
        {
            field:"link",
            headerAlign: "center",
            headerName:"",
            maxWidth: 75,
            align:"center",
            flex:1,
            renderCell: (param) => {
                const id = param.row.id
                return <IconButton children={<SearchIcon/>} onClick={() => navigate(`/sensor/${id}`)}/>
            }
        },
        {
            field:"road",
            headerName:"Route",
            minWidth: 300,
            align: "center",
            headerAlign: "center",
            flex:1,
        },
        {
            field:"sensor",
            headerName:"Capteur",
            width: 150,
            align: "center",
            flex:1,
            headerAlign: "center",
        },
        {
            field:"currentWear",
            headerName:"Usure",
            width: 150,
            align: "center",
            flex:1,
            headerAlign: "center",
            renderCell : (param) => {
                const wear = param.row.wear;
                return <Typography color={colorWear(wear)}>{`${wear}%`}</Typography>
            }
        },
        {
            field:"usage",
            headerName:"Nb passages/jour",
            width: 150,
            align: "center",
            flex:1,
            headerAlign: "center",
        },
    ] as GridColDef[];

    // Rows
    const [roads, setRoads] = useState<Road[]>([]);
    const [sensors, setSensors] = useState<Sensor[]>([]);

    useEffect(() => {
        const requestRoads = (async () => {
            const rawResponse = await fetch(roadsUrl, {
                method: 'GET',
                headers:{
                  'Content-type':'application/json', 
                }})
            
            if (rawResponse.status !== 200) {
                const error = await rawResponse.json()
                console.log(error["message"])
                return;
            }
            
            const content = await rawResponse.json();
            const roadData = content["content"]
            return roadData;
        });
    
        
        requestRoads().then((response) => {
            const castRoads = castAll(response);
            setRoads(castRoads);
        });
    
    }, []);

    useEffect(() => {
        const requestSensors = (async () => {
            const rawResponse = await fetch(sensorsUrl, {
                method: 'GET',
                headers:{
                  'Content-type':'application/json', 
                }})
            
            if (rawResponse.status !== 200) {
                const error = await rawResponse.json()
                console.log(error["message"])
                return;
            }
            
            const content = await rawResponse.json();
            const sensorData = content["content"];
            return sensorData;
        });
    
        
        requestSensors().then((response) => {
            const castSensors = castAll(response);
            setSensors(castSensors);
        });
    
    }, []);

    const gridDisplayableRoads = join(sensors, roads);
    const visualRoads = toDisplayableRoads(roads);
    const visualSensors = toDisplayableMarkers(sensors);
    
    return {
        columns,
        gridDisplayableRoads,
        visualRoads,
        visualSensors,
    }
}