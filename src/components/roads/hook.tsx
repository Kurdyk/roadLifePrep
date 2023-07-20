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

const castAll = (rawData:any[]) => {
    if (rawData === undefined) {
        return [];
    }
    return rawData.map((objectString, index) => {
        try {
            const asObject = JSON.parse(objectString)
            asObject["id"] = index;
            return asObject;
        } catch {
            const asObject = objectString
            asObject["id"] = index;
            return asObject;
        }
        
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
    const roadToSensorNumber = new Map<string, number>();
    sensors.forEach(({id: sensorId, roadId: sensorRoadId}) => {
        roads.forEach(({id: roadId, name, wearScore}) => {
            const postalCode = name.postalCode;
            if (String(roadId) === String(sensorRoadId)) {
                var cmpt = roadToSensorNumber.get(roadId);
                if (cmpt === undefined) {
                    cmpt = 1;
                } 
                roadToSensorNumber.set(roadId, cmpt + 1)
                result.push({
                    road: `${name.streetName} ${name.postalCode} ${name.city}`,
                    id:id++,
                    sensor: `CAP_${postalCode}_${fillNumber(cmpt)}`,
                    wear:wearScore,
                    usage:0,
                } as DispayableRoad) 
            }
        })
    })
    return result;
}

// utils for map
const toDisplayableMarkers = (sensors:Sensor[], sensorsPostalCode:Map<string, string>):MarkerInfo[] => {
    return sensors.map(({position, id}, index) => {
        return {position: position,
            text:`CAP_${sensorsPostalCode.get(id)}_${id}`,
            link:`/sensor/${id}`,
            icon: greenIcon,
            id:index,
            interactive:true}
    });
}

const toDisplayableRoads = (roads:Road[]):LinesInfo[] => {
    return roads.map(({id, roadPosition, wearScore}) => {
        return {
            position: roadPosition,
            color : colorWear(wearScore),
            id: id,
    }})
}

// UseData
export const useData = () => {

    const navigate = useNavigate();

    // loading
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
            minWidth: 150,
            align: "center",
            flex:1,
            headerAlign: "center",
        },
        {
            field:"wearScore",
            headerName:"Usure",
            minWidth: 150,
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
            minWidth: 150,
            align: "center",
            flex:1,
            headerAlign: "center",
        },
    ] as GridColDef[];

    // Rows
    const [roads, setRoads] = useState<Road[]>([]);
    const [sensors, setSensors] = useState<Sensor[]>([]);
    const [sensorsPostalCode, setSensorsPostalCode] = useState<Map<string, string>>(new Map<string, string>()); // sensor id -> postal code

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
            const roadData = content["roadList"]
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
            const sensorData = content["sensorList"];
            return sensorData;
        });
    
        
        requestSensors().then((response) => {
            const castSensors = castAll(response);
            setSensors(castSensors);
            setIsLoading(false)
        });
    
    }, []);


    useEffect(() => {
        const updateSensorsPostalCode = () => {
          const map = new Map<string, string>();
          // Update the map based on the sensors and roads data
          sensors.forEach(({ id: sensorId, roadId: sensorRoadId }) => {
            roads.forEach(({ id: roadId, name }) => {
              const postalCode = name.postalCode;
              if (String(roadId) === String(sensorRoadId)) {
                // Update the map with the sensor id and postal code
                map.set(sensorId, postalCode);
              }
            });
          });
          setSensorsPostalCode(map);
        };
    
        updateSensorsPostalCode();
    }, [sensors, roads]);

    const gridDisplayableRoads = join(sensors, roads);
    const visualRoads = toDisplayableRoads(roads);
    const visualSensors = toDisplayableMarkers(sensors, sensorsPostalCode);

    return {
        columns,
        gridDisplayableRoads,
        visualRoads,
        visualSensors,
        isLoading,
    }
}