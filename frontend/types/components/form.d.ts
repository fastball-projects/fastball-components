import { FieldInfo, ActionInfo, Data } from '../common'
import { BasicComponentProps, PopupComponentProps } from '../component'

export type FormProps = {
    headerTitle?: string
    showReset: boolean
    variableForm: boolean
    readonly: boolean
    size?: FormSize
    fields: FieldInfo[]
    actions?: ActionInfo[]
    data?: Data
    initialValues?: Data
} & BasicComponentProps & PopupComponentProps

export type FormSize = 'small' | 'middle' | 'large'