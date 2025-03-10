import { FieldInfo, ActionInfo, ApiActionInfo, PopupActionInfo, ReferencedComponent, Data } from '../common'
import { BasicComponentProps, MultiDataComponent } from '../component'

export type ColumnInfo = {
    sortable?: boolean
    copyable?: boolean
    width?: number
} & FieldInfo

export type SummaryField = {
    index: number
    colSpan: number
    value: any
} & FieldInfo

export type TableRecordActionInfo = ApiActionInfo & PopupActionInfo

export type TableProps = {
    headerTitle?: string
    childrenFieldName?: string
    recordTriggerType?: RecordTriggerType
    lightQuery: boolean
    pageable: boolean
    showRowIndex: boolean
    searchable: boolean
    wrappedSearch: boolean
    keywordSearch: boolean
    horizontalScroll: boolean
    size: TableSize
    columns: ColumnInfo[]
    queryFields: FieldInfo[]
    actions?: ActionInfo[]
    selectionActions?: ActionInfo[]
    selectionViewActions?: ActionInfo[]
    recordActions?: TableRecordActionInfo[]
    originalOptionRender?: (Data, number) => ReactNode
    rowExpandedComponent?: ReferencedComponent
} & BasicComponentProps & MultiDataComponent


export type TableSize = 'small' | 'middle' | 'large'

export type RecordTriggerType = 'OnRecordClick' | 'OnRecordDoubleClick' | 'OnRecordContextMenuClick' | 'OnRecordSelected'