import { FieldInfo, ActionInfo, ApiActionInfo, PopupActionInfo, ReferencedComponent } from '../common'
import { BasicComponentProps, MultiDataComponent } from '../component'

export type ColumnInfo = {
    sortable?: boolean
    copyable?: boolean
} & FieldInfo

export type TableRecordActionInfo = ApiActionInfo & PopupActionInfo

export type TableProps = {
    headerTitle?: string
    childrenFieldName?: string
    columns: ColumnInfo[]
    queryFields: FieldInfo[]
    actions?: ActionInfo[]
    recordActions?: TableRecordActionInfo[]
    rowExpandedComponent?: ReferencedComponent
} & BasicComponentProps & MultiDataComponent
