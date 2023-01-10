import { FieldInfo, ActionInfo, Data } from '../common'
import { LowcodeComponentProps, PopupComponentProps } from '../component'

export type DescriptionProps = {
    headerTitle?: string
    column?: number
    variableDescription: boolean
    size?: DescriptionSize
    fields: FieldInfo[]
    actions?: ActionInfo[]
    data?: Data
} & LowcodeComponentProps & PopupComponentProps

export type DescriptionSize = 'default' | 'middle' | 'small'