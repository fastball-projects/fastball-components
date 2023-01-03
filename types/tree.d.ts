import { ApiActionInfo, ActionInfo, ReferencedComponent, Data } from './common'
import { LowcodeComponentProps, MultiDataComponent } from './component'

export type TreeRecordActionInfo = {
    refresh?: boolean
} & ApiActionInfo

export type TreeProps = {
    fieldNames: {
        key: string
        title: string
        children: string
    }
    data?: Data[]
    recordActions?: TreeRecordActionInfo[]
} & LowcodeComponentProps & MultiDataComponent
