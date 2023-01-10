import { FieldInfo, ActionInfo, Data } from '../common'
import { LowcodeComponentProps, PopupComponentProps } from '../component'

export type FormProps = {
    headerTitle?: string
    showReset: boolean
    variableForm: boolean
    size?: FormSize
    fields: FieldInfo[]
    actions?: ActionInfo[]
    data?: Data
    initialValues?: Data
} & LowcodeComponentProps & PopupComponentProps

export type FormSize = 'small' | 'middle' | 'large'