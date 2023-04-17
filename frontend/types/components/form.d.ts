import { FieldInfo, ActionInfo, Data } from '../common'
import { BasicComponentProps, PopupComponentProps } from '../component'

export type FormProps = {
    column?: number
    headerTitle?: string
    showReset: boolean
    variableForm: boolean
    readonly: boolean
    size?: FormSize
    fields: FormFieldInfo[]
    recordActions?: ActionInfo[]
    valueChangeHandlers?: ValueChangeHandler[]
    data?: Data
    initialValues?: Data
} & BasicComponentProps & PopupComponentProps

export type FormFieldInfo = {
    fieldDependencyInfoList?: FieldDependencyInfo[]
    conditionComposeType?: ConditionComposeType
} & FieldInfo

export type FieldDependencyInfo = {
    field: string
    value: string
    condition: FieldDependencyCondition
}

export type ValueChangeHandler = {
    watchFields: string[]
    handlerKey: string
}

export type FieldDependencyCondition = 'Equals' | 'NotEquals'

export type ConditionComposeType = 'And' | 'Or'

export type FormSize = 'small' | 'middle' | 'large'