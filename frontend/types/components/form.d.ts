import { FieldInfo, ActionInfo, Data } from '../common'
import { BasicComponentProps, PopupComponentProps } from '../component'

export type FormProps = {
    formRef?: React.RefObject<ProFormInstance>
    column?: number
    headerTitle?: string
    layout?: FormLayout
    showReset: boolean
    variableForm: boolean
    readonly: boolean
    size?: FormSize
    fields: FormFieldInfo[]
    actions?: ActionInfo[]
    recordActions?: ActionInfo[]
    valueChangeHandlers?: ValueChangeHandler[]
} & BasicComponentProps & PopupComponentProps

export type FormFieldInfo = {
    addonBefore?: string
    addonAfter?: string
    placeholder?: string
    entireRow?: boolean
    newRow?: boolean
    subTableCreatorButtonText?: String
    subTableRecordActions?: ActionInfo[]
    fieldDependencyInfoList?: FieldDependencyInfo[]
    conditionComposeType?: ConditionComposeType
    fieldDependencyType?: FieldDependencyType
} & FieldInfo

export type TableFormProps = {
    fields: TableFormFieldInfo[]
    rowKey: string
    childrenFieldName: string
    rowEditable: boolean
    rowSelectable: boolean
    defaultSelected?: boolean
    value?: Data[]
    onChange?: Function
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

export type FormLayout = 'Vertical' | 'Horizontal'