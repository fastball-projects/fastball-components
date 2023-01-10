import { ApiActionInfo, Data } from '../common'
import { LowcodeComponentProps, MultiDataComponent } from '../component'

export type TimelineProps = {
    fieldNames: {
        key: string
        title: string
        time?: string
        color?: string
    }
    data?: Data[]
    recordActions?: ApiActionInfo[]
} & LowcodeComponentProps & MultiDataComponent