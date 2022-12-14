import { FieldInfo, ActionInfo } from './common'
import { LowcodeComponentProps } from './component'

export type ColumnInfo = {
    sortable?: boolean
    copyable?: boolean
} & FieldInfo

export type TableRecordActionInfo = {
    refresh?: boolean
} & ApiActionInfo

export type TableProps = {
    componentKey: string
    headerTitle?: string
    columns: ColumnInfo[]
    query: FieldInfo[]
    actions?: ActionInfo[]
    recordActions?: TableRecordActionInfo[]
} & LowcodeComponentProps

export type FormProps = {
    componentKey: string
    headerTitle?: string
    fields: FieldInfo[]
    actions?: ActionInfo[]
} & LowcodeComponentProps