import { FieldInfo, ActionInfo, Data } from '../common'
import { BasicComponentProps, PopupComponentProps } from '../component'

export type FormProps = {
    column?: number
    headerTitle?: string
    showReset: boolean
    variableForm: boolean
    readonly: boolean
    size?: FormSize
    fields: FieldInfo[]
    recordActions?: ActionInfo[]
    data?: Data
    initialValues?: Data
} & BasicComponentProps & PopupComponentProps

export type FormSize = 'small' | 'middle' | 'large'