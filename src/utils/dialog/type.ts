import { ReactNode } from "react";

export type DialogComponentProps = {
    children?: ReactNode,
    dialogOpener : string | ReactNode, 
    text?: string,
    title? : string,
    dialogButtons? : {id?:number, text : string, onClick : () => void }[]
}