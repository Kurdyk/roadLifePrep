import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import ActionButtonGroupComponent from "utils/atoms/buttonGroup/actionButtonGroup";
import { ActionButtonProps } from "utils/atoms/buttonGroup/actionButtonGroup/type";
import { User } from "./type";

const url = "http://localhost:5555/users";

// utils
const castToRowData = (userString:string) => {
    const replaceRegex = /| |"/g;
    const filtered = userString.replaceAll(replaceRegex, "");
    const asObject = JSON.parse(filtered);
    const action = [
        {
            id:1, 
            buttonText:"Modification",
            clickHandler: () => {},
        },
        {
            id:2, 
            buttonText:"Suppresion",
            clickHandler: () => {}
        }
    ] as ActionButtonProps[];
    asObject["actions"] = action;
    return asObject;
}

const castAll = (rawData:string[]) => {
    return rawData.map((userString, index) => {
        const asObject = castToRowData(userString);
        asObject["id"] = index;
        return asObject;
    })
}

// UseData
export const useData = () => {

    // Columns
    const columns = [
        {
            field:"prenom",
            headerName:"Prénom",
            width: 150,
            align: "center",
            flex:1,
            headerAlign: "center",
        },
        {
            field:"nom",
            headerName:"Nom",
            width: 150,
            flex:1,
            align: "center",
            headerAlign: "center",
        },
        {
            field:"mail",
            headerName:"Mail",
            width: 150,
            flex:1,
            align: "center",
            headerAlign: "center",
        },
        {
            field:"role",
            headerName:"Rôle",
            width: 150,
            align: "center",
            flex:1,
            headerAlign: "center",
        },
        {
            field:"actions",
            headerName:"Possible actions",
            sortable:false,
            renderCell: (param) => {
                const props = param.value as ActionButtonProps[];
                return <ActionButtonGroupComponent actionButtonPropsList={props} />
            },
            width: 300,
            align: "center",
            headerAlign: "center",
        }
    ] as GridColDef[];

    // Rows
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const requestUsers = (async () => {
            const rawResponse = await fetch(url, {
                method: 'GET',
                headers:{
                  'Content-type':'application/json', 
                  "token":sessionStorage.getItem("token")!,
                }})
            
            if (rawResponse.status !== 200) {
                const error = await rawResponse.json()
                console.log(error["message"])
                return;
            }
            
            const content = await rawResponse.json();
            const userData = content["content"]
            return userData;
        });
    
        
        requestUsers().then((response) => {
            const castUsers = castAll(response);
            setUsers(castUsers);
        });
    
    }, []);
    
    return {
        columns,
        users,
    }
}