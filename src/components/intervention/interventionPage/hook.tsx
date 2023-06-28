import { Intervention } from "./type";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { ExtendedGridColDef } from "utils/SearchableDataGrid/type";
import { DialogComponentProps } from "utils/dialog/type";
import { Box, TextField, Typography } from "@mui/material";
import DialogComponent from "utils/dialog";

const url = `http://localhost:5000/intervention/all`;


// Updating methods
const postModify = ( async (id:string, action:string, commentary:string) => {
    const postUrl = `http://localhost:5000/intervention/${action}/${id}`;
    
    const rawResponse = await fetch(postUrl, {
        method: 'POST',
        headers:{
            'Content-type':'application/json', 
            "token":sessionStorage.getItem("token")!,
        },
        body: JSON.stringify({
            "content": commentary,
        })
    });

    if (rawResponse.status !== 200) {
        return
    } else {
        window.location.reload();
    }
    }
)

const castAll = (rawList : Intervention[], 
                commentary:MutableRefObject<string>): Intervention[] => {
    return rawList.map((rawIntervention, index) => {
        // Actions
        let actions = [] as DialogComponentProps[];
        switch (rawIntervention["state"]) {
            case "Demandée":
                actions = [
                    {
                        title: `Vous allez valider la demande ${rawIntervention.interventionId}`,
                        dialogOpener : "Valider",
                        dialogButtons: [
                            {
                                id: 1,
                                text: "Valider la demande",
                                onClick: () => {postModify.call(undefined, rawIntervention.interventionId, "accept", commentary.current)},
                            }
                        ]
                    },
                    {
                        children: <TextField 
                                    placeholder="Refusal text"
                                    onChange={(event) => {commentary.current = event.target.value;}} 
                                    multiline
                                    className="CommentaryField"/>,
                        title: `Vous allez refuser la demande ${rawIntervention.interventionId}`,
                        text: "Ajouter un commentaire",
                        dialogOpener : "Refuser",
                        dialogButtons: [
                            {
                                id: 1,
                                text: "Refuser la demande",
                                onClick: () => {postModify.call(undefined, rawIntervention.interventionId, "refuse", commentary.current)},
                            }
                        ]
                    },
                ];
                break;
            case "En cours":
                actions = [
                    {
                        children: <TextField 
                                    placeholder="Solved text" 
                                    onChange={(event) => {commentary.current = event.target.value;}}
                                    multiline
                                    className="CommentaryField"/>,
                        title: `Vous allez marquer la demande ${rawIntervention.interventionId} comme terminée`,
                        text: "Ajouter un commentaire",
                        dialogOpener : "Terminer",
                        dialogButtons: [
                            {
                                id: 1,
                                text: "Terminée la demande",
                                onClick: () => {postModify.call(undefined, rawIntervention.interventionId, "end", commentary.current)},
                            }
                        ]
                    },
                ]
                break;
            default:
                break;
        }
        rawIntervention["actions"] = actions;
        // Last mododification and related
        let lastStateModification = "";
        let gain = 0;
        let report = "";
        switch (rawIntervention.state) {
            case "En cours":
                lastStateModification = `${rawIntervention.state} le ${rawIntervention.dateValidation}`
                break;
            case "Refusée":
                lastStateModification = `${rawIntervention.state} le ${rawIntervention.dateRefusal}`
                report = rawIntervention.refusalDescription!;
                break;
            case "Terminée":
                lastStateModification = `${rawIntervention.state} le ${rawIntervention.dateSolved}`
                report = rawIntervention.report!;
                gain = rawIntervention.gain!;
                break;
        }
        return {...rawIntervention, actions:actions, id:index, lastStateModification:lastStateModification, report:report, gain:gain};
    })
}

export const useData = () => {

    // Loading
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Columns
    const columns = [
        {
            field:"interventionId",
            headerName:"ID",
            minWidth: 330,
            align: "center",
            headerAlign: "center",
            flex:1,
        },
        {
            field:"roadLocalisation",
            headerName:"Route",
            minWidth: 250,
            align: "center",
            headerAlign: "center",
            flex:1,
            renderCell: (param) => {
                const localisation = param.row.roadLocalisation as string;
                const toDisplay = localisation.split("_")
                return (
                    <Box className="RoadNameWrapper">
                        {toDisplay.map((text) => {return <Typography>{text}</Typography>})}
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
            id : "DatePicker"
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
            checkboxeFilter : ["Demandée", "Refusée", "En cours", "Terminée"],
            title : "Selection de l'état:",
            id : "StatePicker"
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
            field:"gain",
            headerName:"Gain score",
            minWidth: 150,
            align: "center",
            flex:1,
            headerAlign: "center",
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

        const stateConversion = new Map<number, string>([
            [0, "Demandée"],
            [1, "Refusée"],
            [2, "En cours"],
            [3, "Terminée"],
        ]);

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
            const intervertionData = content["content"]
            return intervertionData.map((rawIntervention:any) => {
                rawIntervention.askDate = dayjs(rawIntervention.askDate).toDate(); // Case to date type
                rawIntervention.state = stateConversion.get(rawIntervention.state);
                return rawIntervention;
            }) ;
        });
    
        requestRoads().then((response) => {
            const castInterventions = castAll(response, commentary);
            setInterventions(castInterventions);
            setIsLoading(false);
        });
    
    }, []);

    return {
        interventions,
        columns,
        isLoading,
    }
}