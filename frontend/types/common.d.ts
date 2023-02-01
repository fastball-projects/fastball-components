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

export type RefComponentInfo = {
    componentInfo: ReferencedComponent;
    currentFieldInput: boolean;
    dataPath: string[];
    propsKey: string
}

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
    input?: any
    onClose?: Function
    trigger: ReactComponent
    popupInfo: PopupInfo
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
    popupInfo?: PopupInfo
    editModeComponent?: RefComponentInfo
    displayModeComponent?: RefComponentInfo
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
    needArrayWrapper?: boolean
    componentKey: string
    type: 'API'
} & ActionInfo

export type PopupActionInfo = {
    type: 'Popup'
    popupInfo: PopupInfo
} & ActionInfo

export type PopupInfo = {
    title?: string
    width?: number
    popupType: PopupType
    triggerType: TriggerType
    placementType: PlacementType
    popupComponent: RefComponentInfo
}

export type LoadDataType = () => any

export type ActionType = 'API' | 'Rest' | 'Popup' | 'Digit'

export type PopupType = 'Modal' | 'Drawer' | 'Popover'

export type TriggerType = 'Click' | 'Hover' | 'ContextMenu'

export type PlacementType = 'left' | 'right' | 'top' | 'bottom'

export type DisplayType = 'Show' | 'Hidden' | 'Disabled'
