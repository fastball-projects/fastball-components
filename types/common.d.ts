export type Data = { [key: string]: unknown }

type Displayable = {
    display?: boolean
}



export type PopupType = 'Modal' | 'Drawer'

export type PopupComponent = {
    trigger?: JSX.Element
    onClose?: Function
    popupType?: PopupType
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
    closeOnSuccess?: boolean
    callback?: Function
    data?: Data | Data[]
    loadData?: LoadDataType
    actionKey: string
    type: ActionType
} & Displayable

export type ApiActionInfo = {
    componentKey: string
    type: 'API'
} & ActionInfo

export type PopupActionInfo = {
    componentClass: string
    componentPackage: string
    componentPath: string
    componentName: string
    type: 'Popup'
} & ActionInfo

export type LoadDataType = () => Data | Data[]

export type ActionType = 'API' | 'Rest' | 'Popup' | 'Digit'
