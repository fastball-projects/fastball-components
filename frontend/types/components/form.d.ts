import { FieldInfo, ActionInfo, Data } from '../common'
import { BasicComponentProps, PopupComponentProps } from '../component'

export type FormProps = {
    formRef?: React.RefObject<ProFormInstance>
    column?: number
    headerTitle?: string
    showReset: boolean
    variableForm: boolean
    readonly: boolean
    size?: FormSize
    fields: FormFieldInfo[]
    actions?: ActionInfo[]
    recordActions?: ActionInfo[]
    valueChangeHandlers?: ValueChangeHandler[]
    data?: Data
    initialValues?: Data
} & BasicComponentProps & PopupComponentProps

export type FormFieldInfo = {
    fieldDependencyInfoList?: FieldDependencyInfo[]
    conditionComposeType?: ConditionComposeType
    fieldDependencyType?: FieldDependencyType
} & FieldInfo

export type TableFormProps = {
    fields: TableFormFieldInfo[]
    rowKey: string
    rowSelectable: boolean
} & FormProps


export type TableFormFieldInfo = {
    hideInTable?: boolean
    hideInForm?: boolean
    editInTable?: boolean
    editInForm?: boolean
    sortable?: boolean
    copyable?: boolean
} & FormFieldInfo

export type FieldDependencyInfo = {
    field: string
    value: string
    condition: FieldDependencyCondition
}

export type ValueChangeHandler = {
    watchFields: string[]
    handlerKey: string
}

export type FieldDependencyCondition = 'Empty' | 'NotEmpty' | 'Equals' | 'NotEquals' | 'GreaterThan' | 'LessThan' | 'GreaterThanOrEquals' | 'LessThanOrEquals'

export type ConditionComposeType = 'And' | 'Or'

export type FieldDependencyType = 'Hidden' | 'Readonly'

export type FormSize = 'small' | 'middle' | 'large'