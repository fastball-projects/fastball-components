import { ApiActionInfo, ActionInfo, ReferencedComponent, Data } from '../common'
import { BasicComponentProps, MultiDataComponent } from '../component'

export type TreeProps = {
    fieldNames: {
        key: string
        title: string
        children: string
    }
    defaultExpandAll: boolean
    data?: Data[]
    recordActions?: ApiActionInfo[]
} & BasicComponentProps & MultiDataComponent
