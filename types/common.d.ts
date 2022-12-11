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
    actionKey: string
    actionName: string
    type: ActionType
} & Displayable


export type ApiActionInfo = {
    componentKey: string
} & ActionInfo

export type ActionType = 'API' | 'Rest' | 'Drawer' | 'Modal' | 'Digit'
