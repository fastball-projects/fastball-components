import { FieldInfo, ActionInfo, ReferencedComponent } from './common'
import { LowcodeComponentProps } from './component'

export type ColumnInfo = {
    sortable?: boolean
    copyable?: boolean
} & FieldInfo

export type TableRecordActionInfo = {
    refresh?: boolean
} & ApiActionInfo

export type TableProps = {
    headerTitle?: string
    columns: ColumnInfo[]
    query: FieldInfo[]
    actions?: ActionInfo[]
    recordActions?: TableRecordActionInfo[]
    rowExpandedComponent?: ReferencedComponent
} & LowcodeComponentProps
