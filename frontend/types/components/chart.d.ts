import { Data } from '../common'
import { BasicComponentProps, MultiDataComponent } from '../component'

export type ChartProps = {
    type: ChartType
    title: string,
    palette: string,
    bordered: boolean,
    borderColor: string,
    fieldNames: {
        xField: string
        yField: string
        seriesField?: string
    }
} & BasicComponentProps & MultiDataComponent

export type ChartType = 'Line' | 'Area' | 'Column' | 'Bar' | 'Pie' | 'Donut'