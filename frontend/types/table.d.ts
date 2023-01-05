import { FieldInfo, ActionInfo, ReferencedComponent } from './common'
import { LowcodeComponentProps, MultiDataComponent } from './component'

export type ColumnInfo = {
    sortable?: boolean
    copyable?: boolean
} & FieldInfo

export type TableRecordActionInfo = {
    refresh?: boolean
} & ApiActionInfo

export type TableProps = {
    headerTitle?: string
    childrenFieldName?: string
    columns: ColumnInfo[]
    queryFields: FieldInfo[]
    actions?: ActionInfo[]
    recordActions?: TableRecordActionInfo[]
    rowExpandedComponent?: ReferencedComponent
} & LowcodeComponentProps & MultiDataComponent
