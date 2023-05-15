import { FieldInfo, ActionInfo, ApiActionInfo, PopupActionInfo, ReferencedComponent, Data } from '../common'
import { BasicComponentProps, MultiDataComponent } from '../component'

export type ColumnInfo = {
    sortable?: boolean
    copyable?: boolean
} & FieldInfo

export type TableRecordActionInfo = ApiActionInfo & PopupActionInfo

export type TableProps = {
    headerTitle?: string
    childrenFieldName?: string
    wrappedSearch: boolean
    keywordSearch: boolean
    size: TableSize
    columns: ColumnInfo[]
    queryFields: FieldInfo[]
    actions?: ActionInfo[]
    recordActions?: TableRecordActionInfo[]
    originalOptionRender?: (Data, number) => ReactNode
    rowExpandedComponent?: ReferencedComponent
} & BasicComponentProps & MultiDataComponent



export type TableProps = {
    headerTitle?: string
    childrenFieldName?: string
    wrappedSearch: boolean
    keywordSearch: boolean
    size: TableSize
    columns: ColumnInfo[]
    queryFields: FieldInfo[]
    actions?: ActionInfo[]
    recordActions?: TableRecordActionInfo[]
    rowExpandedComponent?: ReferencedComponent
} & BasicComponentProps & MultiDataComponent


export type TableSize = 'small' | 'middle' | 'large'