import { ReactElement, ReactNode } from "react";

export type RoleComponentProps = {
    children: ReactElement | ReactNode ;
    role : string,
    mapKey : string,
}