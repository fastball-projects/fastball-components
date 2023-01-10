import { ReactComponent } from "./component"
import { ValidationRule } from './validation'

export type Data = { [key: string]: unknown }

type Displayable = {
    display?: DisplayType
}

export type ReferencedComponent = {
    component?: ReactComponent
    componentClass: string
    componentPackage: string
    componentPath: string
    componentName: string
}

export type PopupProps = {
    title?: string
    width?: number
    placementType?: PlacementType
    popupType: PopupType
    trigger: ReactComponent
    popupComponent: ReferencedComponent
    input?: any
    onClose?: Function
}

export type FieldInfo = {
    dataIndex: string
    valueType: string
    tooltip?: string
    validationRules?: ValidationRule[]
    valueEnum?: { [key: string]: unknown }
    popupInfo?: PopupInfo
    lookupAction?: LookupActionInfo
    fieldProps: any
} & Displayable

export type ActionInfo = {
    actionName?: string
    componentKey?: string
    refresh?: boolean
    closePopupOnSuccess?: boolean
    callback?: Function
    trigger?: ReactComponent
    data?: Data | Data[]
    loadData?: LoadDataType
    actionKey: string
    type: ActionType
} & Displayable

export type LookupActionInfo = {
    packageName?: string
    lookupKey: string
    labelField: string
    valueField: string
    multiple: boolean
    childrenField?: string
}
export type TreeLookupActionInfo = {
    childrenField: string
} & LookupActionInfo

export type ApiActionInfo = {
    componentKey: string
    type: 'API'
} & ActionInfo

export type PopupActionInfo = {
    type: 'Popup'
} & ActionInfo & PopupInfo

export type PopupInfo = {
    popupTitle?: string
    width?: number
    popupType: PopupType
    placementType: PlacementType
    popupComponent: ReferencedComponent
}

export type LoadDataType = () => any

export type ActionType = 'API' | 'Rest' | 'Popup' | 'Digit'

export type PopupType = 'Modal' | 'Drawer' | 'Popover'

export type PlacementType = 'left' | 'right' | 'top' | 'bottom'

export type DisplayType = 'Show' | 'Hidden' | 'Disabled'
