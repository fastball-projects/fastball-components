import { FieldInfo, ActionInfo } from './common'

export type ColumnInfo = {
    sortable?: boolean
    copyable?: boolean
} & FieldInfo

export type TableRecordActionInfo = {
    refresh?: boolean
} & ActionInfo

export type TableProps = {
    headerTitle? : string
    columns: ColumnInfo[]
    query: FieldInfo[]
    recordActions?: TableRecordActionInfo[]
}