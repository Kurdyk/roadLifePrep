import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import ActionButtonGroupComponent from "utils/atoms/buttonGroup/actionButtonGroup";
import { ActionButtonProps } from "utils/atoms/buttonGroup/actionButtonGroup/type";
import { User } from "./type";

const url = "http://localhost:5555/users";

// fetching function
const actionOnUser = (async (userId: string, action: "DELETE" | "PUT") => {
    console.log(userId)
    const rawResponse = await fetch(url + `/${userId}`, {
        method: action,
        headers:{
            'Content-type':'application/json', 
            "token":sessionStorage.getItem("token")!,
        }})
    
        if (rawResponse.status !== 200) {
            const error = await rawResponse.json()
            console.log(error["message"])
            return;
        } else {
            window.location.reload();
        }
})

// utils
const castToRowData = (user:User) => {
    const action = [
        {
            id:1, 
            buttonText:"Modification",
            clickHandler: () => {actionOnUser(user.id, "PUT")},
        },
        {
            id:2, 
            buttonText:"Suppresion",
            clickHandler: () => {actionOnUser(user.id, "DELETE")},
        }
    ] as ActionButtonProps[];
    user.actions = action;
    return user;
}

const castAll = (rawData:User[]) => {
    return rawData.map((userString, ) => {
        const asObject = castToRowData(userString);
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
            minWidth: 150,
            align: "center",
            flex:1,
            headerAlign: "center",
        },
        {
            field:"nom",
            headerName:"Nom",
            minWidth: 150,
            flex:1,
            align: "center",
            headerAlign: "center",
        },
        {
            field:"mail",
            headerName:"Mail",
            minWidth: 150,
            flex:1,
            align: "center",
            headerAlign: "center",
        },
        {
            field:"role",
            headerName:"Rôle",
            minWidth: 150,
            align: "center",
            flex:1,
            headerAlign: "center",
        },
        {
            field:"actions",
            headerName:"Possible actions",
            sortable:false,
            renderCell: (param) => {
                if (param.row.role === "collectivite") return null
                const props = param.value as ActionButtonProps[];
                return <ActionButtonGroupComponent actionButtonPropsList={props} />
            },
            minWidth: 300,
            align: "center",
            headerAlign: "center",
        },
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
            const userData = content["userList"]
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