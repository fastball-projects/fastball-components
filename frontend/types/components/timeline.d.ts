import { ApiActionInfo, Data } from '../common'
import { BasicComponentProps, MultiDataComponent } from '../component'

export type TimelineProps = {
    fieldNames: {
        key: string
        left: string
        right: string
        color?: string
    }
    data?: Data[]
    recordActions?: ApiActionInfo[]
} & BasicComponentProps & MultiDataComponent