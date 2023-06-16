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
    loadInput?: LoadDataType
    onClose?: Function
    trigger: ReactComponent
    popupInfo: PopupInfo
    __designMode?: string
}

export type PrintProps = {
    key?: string
    printRef?: MutableRefObject
    input?: any
    onClose?: Function
    trigger: ReactComponent
    printComponent: RefComponentInfo
    __designMode?: string
}

export type FieldInfo = {
    dataIndex: string[]
    valueType: string
    fieldType: string
    tooltip?: string
    placeholder?: string
    defaultValue?: any
    validationRules?: ValidationRule[]
    valueEnum?: { [key: string]: EnumItem }
    autoComplete?: AutoCompleteActionInfo
    dependencyFields?: string[]
    lookup?: LookupActionInfo
    popupInfo?: PopupInfo
    editModeComponent?: RefComponentInfo
    displayModeComponent?: RefComponentInfo
    subFields?: FieldInfo[]
    readonly: boolean
    entireRow: boolean
    fieldProps: any
    formItemProps: any
    expression: ExpressionInfo
} & Displayable

export type ActionRef = {
    onClick: Function
}

export type ActionInfo = {
    ref?: MutableRefObject
    actionName?: string
    componentKey?: string
    refresh?: boolean
    needArrayWrapper?: boolean
    closePopupOnSuccess?: boolean
    callback?: Function
    trigger?: ReactComponent
    data?: Data | Data[]
    loadData?: LoadDataType
    loadInput?: LoadDataType
    actionKey: string
    type: ActionType
} & Displayable

export type AutoCompleteActionInfo = {
    autoCompleteKey: string
    inputType: 'Number' | 'Text';
    valueField: string;
    fields: { name: string, title: string }[];
}

export type LookupActionInfo = {
    packageName?: string
    lookupKey: string
    labelField: string
    valueField: string
    multiple: boolean
    showSearch: boolean
    childrenField?: string
    dependencyParams?: DependencyParamInfo[]
    extraFillFields: LookupFillFieldInfo[]
}

export type TreeLookupActionInfo = {
    childrenField: string
} & LookupActionInfo

export type ApiActionInfo = {
    componentKey: string
    confirmMessage?: string
    uploadFileAction?: boolean
    downloadFileAction?: boolean
    type: 'API'
} & ActionInfo

export type PopupActionInfo = {
    type: 'Popup'
    popupInfo: PopupInfo
} & ActionInfo

export type PrintActionInfo = {
    type: 'Print'
    printComponent: RefComponentInfo
} & ActionInfo

export type PopupInfo = {
    title?: string
    width?: number
    popupType: PopupType
    triggerType: TriggerType
    placementType: PlacementType
    popupComponent: RefComponentInfo
}

export type DependencyParamInfo = {
    /**
     * 入参的 Key
     */
    paramKey: string;

    /**
     * 入参的路径, rootValue 为 True 时, 以根对象出发, rootValue 为 False 时, 以当前对象出发
     */
    paramPath: string[];


    /**
     * 是否是对象, 如果为否则为当前层级对象, 为 True 则为跟对象
     */
    rootValue: boolean;
}

export type LookupFillFieldInfo = {
    /**
     * 选项的字段 Key
     */
    fromField: string;
    /**
     * 填充的目标字段 Key
     */
    targetField: string;
    /**
     * 仅为目标值为空时, 进行填充
     */
    onlyEmpty: boolean;
}


export type ExpressionInfo = {
    /**
     * 表达式所需字段
     */
    fields: string[];
    /**
     * 具体表达式内容
     */
    expression: string;
}

export type LoadDataType = () => any

export type ActionType = 'API' | 'Rest' | 'Popup' | 'Digit' | 'Print'

export type PopupType = 'Modal' | 'Drawer' | 'Popover'

export type TriggerType = 'Click' | 'Hover' | 'ContextMenu'

export type PlacementType = 'left' | 'right' | 'top' | 'bottom'

export type DisplayType = 'Show' | 'Hidden' | 'Disabled'
