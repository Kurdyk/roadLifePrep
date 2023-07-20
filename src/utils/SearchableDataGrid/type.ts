import { GridColDef } from "@mui/x-data-grid";

export type CheckBoxInfo = {
    display: string,
    value: any,
}
export type ExtendedGridColDef = GridColDef & { checkboxFilter? : CheckBoxInfo[], title? : string, id? : string }

export type DataGridComponentProps = {
    rows: Object[],
    columns: GridColDef[],
    id? : string,
    loading? :boolean
}

export type DateRange = {
    startDate : Date | null,
    endDate : Date | null,
}