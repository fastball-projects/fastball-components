import { ReactComponent } from "./component"

export type Data = { [key: string]: unknown }

type Displayable = {
    display?: boolean
}

export type ReferencedComponent = {
    component?: ReactComponent
    componentClass: string
    componentPackage: string
    componentPath: string
    componentName: string
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
    type: 'Popup'
    popupComponent: ReferencedComponent
} & ActionInfo

export type LoadDataType = () => Data | Data[]

export type ActionType = 'API' | 'Rest' | 'Popup' | 'Digit'
