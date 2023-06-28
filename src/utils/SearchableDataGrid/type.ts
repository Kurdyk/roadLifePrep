import { GridColDef } from "@mui/x-data-grid";

export type ExtendedGridColDef = GridColDef & { checkboxeFilter? : string[], title? : string, id? : string }

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