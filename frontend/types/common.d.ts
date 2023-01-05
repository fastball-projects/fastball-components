import { ReactComponent } from "./component"
import { ValidationRule } from './validation'

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

export type PopupProps = {
    popupTitle?: String
    popupType: PopupType
    drawerPlacementType: DrawerPlacementType
    trigger: ReactComponent
    popupActionInfo: PopupActionInfo
    onClose?: Function
}

export type FieldInfo = {
    dataIndex: string
    valueType: string
    tooltip?: string
    validationRules?: ValidationRule[]
    valueEnum?: { [key: string]: unknown }
    fieldProps: any
} & Displayable

export type ActionInfo = {
    actionName?: string
    componentKey?: string
    closeOnSuccess?: boolean
    callback?: Function
    trigger?: ReactComponent
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
    popupTitle?: string
    popupType: PopupType
    drawerPlacementType: DrawerPlacementType
    popupComponent: ReferencedComponent
} & ActionInfo

export type LoadDataType = () => Data | Data[]

export type ActionType = 'API' | 'Rest' | 'Popup' | 'Digit'

export type PopupType = 'Modal' | 'Drawer'

export type DrawerPlacementType = 'left' | 'right' | 'top' | 'bottom'
