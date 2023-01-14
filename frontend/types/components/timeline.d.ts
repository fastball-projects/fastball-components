import { ApiActionInfo, Data } from '../common'
import { BasicComponentProps, MultiDataComponent } from '../component'

export type TimelineProps = {
    fieldNames: {
        key: string
        title: string
        time?: string
        color?: string
    }
    data?: Data[]
    recordActions?: ApiActionInfo[]
} & BasicComponentProps & MultiDataComponent