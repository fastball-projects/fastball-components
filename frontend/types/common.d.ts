import { MutableRefObject } from 'react'
import { ReactComponent } from "./component"
import { ValidationRule } from './validation'

export type Data = { [key: string]: unknown }

export type Displayable = {
    display?: DisplayType
}

export declare type CustomTagProps = {
    label: React.ReactNode;
    value: any;
    disabled: boolean;
    onClose: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    closable: boolean;
};

export type ReferencedComponent = {
    component?: ReactComponent
    componentClass: string
    componentPackage: string
    componentPath: string
}

export type MainFieldComponent = ReferencedComponent & {
    componentClass: 'MainFieldComponent'
    mainField: string[]
}

export type EnumItem = {
    text: string
    color?: string
}

export type PopupProps = {
    key?: string
    ref?: MutableRefObject
    title?: string
    width?: number
    placementType?: PlacementType
    popupType: PopupType
    trigger: ReactComponent
    triggerType: TriggerType
    popupComponent: ReferencedComponent
    input?: any
    onClose?: Function
    __designMode?: string
}

export type FieldInfo = {
    dataIndex: string[]
    valueType: string
    fieldType: string
    tooltip?: string
    validationRules?: ValidationRule[]
    valueEnum?: { [key: string]: EnumItem }
    lookup?: LookupActionInfo
    popup?: PopupInfo
    editModeComponent?: UseComponentInfo
    displayModeComponent?: UseComponentInfo
    subFields?: FieldInfo[]
    readonly: boolean
    fieldProps: any
    formItemProps: any
} & Displayable

export type ActionRef = {
    onClick: Function
}

export type ActionInfo = {
    ref?: MutableRefObject
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
    dataPath?: string[]
    popupType: PopupType
    triggerType: TriggerType
    placementType: PlacementType
    popupComponent: ReferencedComponent
}

export type UseComponentInfo = {
    componentInfo: ReferencedComponent
    valueKey: string
    recordKey: string
}

export type LoadDataType = () => any

export type ActionType = 'API' | 'Rest' | 'Popup' | 'Digit'

export type PopupType = 'Modal' | 'Drawer' | 'Popover'

export type TriggerType = 'Click' | 'Hover' | 'ContextMenu'

export type PlacementType = 'left' | 'right' | 'top' | 'bottom'

export type DisplayType = 'Show' | 'Hidden' | 'Disabled'
