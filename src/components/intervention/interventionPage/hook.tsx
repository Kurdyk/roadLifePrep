import { Intervention, Status } from "./type";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { ExtendedGridColDef } from "utils/SearchableDataGrid/type";
import { DialogComponentProps } from "utils/dialog/type";
import { Box, TextField, Typography } from "@mui/material";
import DialogComponent from "utils/dialog";
import { RoadName } from "components/roads/type";

const url = `http://localhost:5111/interventions`;

const requestRoadName = (async (url: string) => {
    
    const rawResponse = await fetch(url, {
        method: 'GET',
        headers:{
        'Content-type':'application/json', 
        },
    });

    if (rawResponse.status !== 200) {
        return 
    }
    
    // success
    const content = await rawResponse.json();
    return content.road.name;
})

// Updating methods
const postModify = ( async (id:string, action:number, commentary:string) => {
    const putUrl = `http://localhost:5111/interventions/${id}`;
    
    const rawResponse = await fetch(putUrl, {
        method: 'PUT',
        headers:{
            'Content-type':'application/json', 
            "token":sessionStorage.getItem("token")!,
        },
        body: JSON.stringify({
            "description": commentary,
            "newState": action,
        })
    });

    if (rawResponse.status !== 200) {
        return
    } else {
        window.location.reload();
    }
    }
)

const castAll = async (rawList: Intervention[], commentary: MutableRefObject<string>): Promise<Intervention[]> => {
  
    const result = await Promise.all(rawList.map(async (rawIntervention, index) => {
      const roadName = await requestRoadName(rawIntervention.roadUrl);
      const actions: DialogComponentProps[] = [];
  
      switch (rawIntervention["state"]) {
        case Status.Asked:
          actions.push({
            title: `Vous allez valider la demande ${rawIntervention.id}`,
            dialogOpener: "Valider",
            dialogButtons: [
              {
                id: 1,
                text: "Valider la demande",
                onClick: () => {
                  postModify(rawIntervention.id, Status.Outgoing, commentary.current);
                },
              },
            ],
          });
          actions.push({
            children: (
              <TextField
                placeholder="Refusal text"
                onChange={(event) => {
                  commentary.current = event.target.value;
                }}
                multiline
                className="CommentaryField"
              />
            ),
            title: `Vous allez refuser la demande ${rawIntervention.id}`,
            text: "Ajouter un commentaire",
            dialogOpener: "Refuser",
            dialogButtons: [
              {
                id: 1,
                text: "Refuser la demande",
                onClick: () => {
                  postModify(rawIntervention.id, Status.Refused, commentary.current);
                },
              },
            ],
          });
          break;
        case Status.Outgoing:
          actions.push({
            children: (
              <TextField
                placeholder="Solved text"
                onChange={(event) => {
                  commentary.current = event.target.value;
                }}
                multiline
                className="CommentaryField"
              />
            ),
            title: `Vous allez marquer la demande ${rawIntervention.id} comme terminée`,
            text: "Ajouter un commentaire",
            dialogOpener: "Terminer",
            dialogButtons: [
              {
                id: 1,
                text: "Terminée la demande",
                onClick: () => {
                  postModify(rawIntervention.id, Status.Solved, commentary.current);
                },
              },
            ],
          });
          break;
        default:
          break;
      }
  
      // Last mododification and related
      let lastStateModification = "";
      let gain = 0;
      let report = "";
      switch (rawIntervention.state) {
          case Status.Outgoing:
              lastStateModification = `Validée le ${rawIntervention.acceptanceDate}`
              break;
          case Status.Refused:
              lastStateModification = `Refusée le ${rawIntervention.refusalDate}`
              report = rawIntervention.refusalDescription!;
              break;
          case Status.Solved:
              lastStateModification = `Terminée le ${rawIntervention.realisationDate}`
              report = rawIntervention.report!;
              gain = rawIntervention.gain!;
              break;
      }
  
      const currentIntervention = {
        ...rawIntervention,
        actions: actions,
        lastStateModification: lastStateModification,
        report: report,
        gain: gain,
        roadName: roadName,
      } as Intervention;
  
      return currentIntervention;
    }));
  
    return result;
    
};  

export const useData = () => {

    // Loading
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Columns
    const columns = [
        {
            field:"id",
            headerName:"ID",
            minWidth: 330,
            align: "center",
            headerAlign: "center",
            flex:1,
        },
        {
            field:"roadName",
            headerName:"Route",
            minWidth: 300,
            maxWidth: 400,
            align: "center",
            headerAlign: "center",
            flex:1,
            renderCell: (param) => {
                const roadName = param.row.roadName as RoadName;
                if (roadName === undefined) return
                return (
                    <Box className="RoadNameWrapper">
                        <Typography>{roadName.streetName}</Typography>
                        <Typography>{roadName.postalCode}</Typography>
                        <Typography>{roadName.city}</Typography>
                    </Box>
                )
            }
        },
        {
            field:"askDate",
            type: "date",
            headerName:"Date de demande",
            minWidth: 150,
            align: "center",
            flex:1,
            headerAlign: "center",
            title: "Selection de la date de demande:",
            id : "DatePicker",
            renderCell: (param) => {
                const date = param.value as Date;
                return dayjs(date).format("DD/MM/YYYY");
            }
        },
        {
            field:"description",
            headerName:"Description",
            minWidth: 150,
            align: "center",
            flex:1,
            headerAlign: "center",
            renderCell : (param) => {
                const content = param.value;
                return <DialogComponent title={"Description"} text={content} dialogOpener={"Description"} />
            }
        },
        {
            field:"state",
            headerName:"Etat",
            minWidth: 150,
            align: "center",
            flex:1,
            headerAlign: "center",
            checkboxFilter : [{display: "Demandée", value:0}, {display: "Refusée", value:1}, 
                            {display: "En cours", value:2}, {display: "Terminée", value:3},],
            title : "Selection de l'état:",
            id : "StatePicker",
            renderCell: (param) => {
                const statusMap: { [key: number]: string } = {
                    0: "Demandée",
                    1: "Refusée",
                    2: "Validée",
                    3: "Terminée",
                };
                return statusMap[param.value];
            }
        },
        {
            field:"lastStateModification",
            headerName:"Dernière modification",
            minWidth: 200,
            align: "center",
            flex:1,
            headerAlign: "center",
        },
        {
            field:"report",
            headerName:"Compte rendu",
            minWidth: 150,
            align: "center",
            flex:1,
            headerAlign: "center",
            renderCell : (param) => {
                const content = param.value;
                return <DialogComponent title={"Rapport"} text={content} dialogOpener={"Rapport"} />
            }
        },
        {
            field:"wearGain",
            headerName:"Gain score",
            minWidth: 150,
            align: "center",
            flex:1,
            headerAlign: "center",
            renderCell: (param) => {
                if (param.value === null || param.value === undefined) return
                return `${param.value}%`
            }
        },
        
    ] as ExtendedGridColDef[];

    if (sessionStorage.getItem("role") === "collectivite") {
        columns.push({
            field:"actions",
            headerName:"Actions",
            minWidth: 200,
            align: "center",
            renderCell: (param) => {
                const props = param.value as DialogComponentProps[];
                return props.map(({children, title, text, dialogButtons,dialogOpener}) => {
                    return <DialogComponent children={children} title={title} text={text} 
                        dialogButtons={dialogButtons} dialogOpener={dialogOpener}
                        />
                })
            },
            flex:1,
            headerAlign: "center",
        },)
    }
    
    // Rows
    const [interventions, setInterventions] = useState<Intervention[]>([]);

    // Commentaries
    const commentary = useRef<string>("");
    
    useEffect(() => {

        const requestRoads = (async () => {
            const rawResponse = await fetch(url, {
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
            const intervertionData = content["interventionList"]
            return intervertionData.map((rawIntervention:any) => {
                rawIntervention.askDate = dayjs(rawIntervention.askDate).toDate(); // Case to date type
                return rawIntervention;
            }) ;
        });
    
        requestRoads().then((response) => {
            const castInterventions = castAll(response, commentary);
            castInterventions.then((list) => {
                setIsLoading(false);
                setInterventions(list);
            })
        });
    
    }, []);

    return {
        interventions,
        columns,
        isLoading,
    }
}