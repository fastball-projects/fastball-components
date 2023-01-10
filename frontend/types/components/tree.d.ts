import { ApiActionInfo, ActionInfo, ReferencedComponent, Data } from '../common'
import { LowcodeComponentProps, MultiDataComponent } from '../component'

export type TreeProps = {
    fieldNames: {
        key: string
        title: string
        children: string
    }
    defaultExpandAll: boolean
    data?: Data[]
    recordActions?: ApiActionInfo[]
} & LowcodeComponentProps & MultiDataComponent
