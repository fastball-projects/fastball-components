import { FieldInfo, ActionInfo, Data } from '../common'
import { BasicComponentProps, PopupComponentProps } from '../component'

export type DescriptionProps = {
    headerTitle?: string
    column?: number
    variableDescription: boolean
    size?: DescriptionSize
    fields: FieldInfo[]
    actions?: ActionInfo[]
    data?: Data
} & BasicComponentProps & PopupComponentProps

export type DescriptionSize = 'default' | 'middle' | 'small'