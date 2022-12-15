export type Data = { [key: string]: unknown }

type Displayable = {
    display?: boolean
}

export type FieldInfo = {
    dataIndex: string
    valueType: string
    tooltip?: string
    valueEnum?: { [key: string]: unknown }
    fieldProps: any
} & Displayable

export type ActionInfo = {
    actionName?: string
    componentKey?: string
    actionKey: string
    type: ActionType
} & Displayable

export type ApiActionInfo = {
    componentKey: string
    type: 'API'
} & ActionInfo

export type ActionType = 'API' | 'Rest' | 'Drawer' | 'Modal' | 'Digit'
