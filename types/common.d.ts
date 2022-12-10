export type Data = { [key: string]: unknown }

export type FieldInfo = { 
    dataIndex: string
    valueType: string
    tooltip?: string
    valueEnum?: {[key: string]: unknown}
    display: boolean
    fieldProps: any
}

export type ActionInfo = { 
    actionKey: string
    actionName: string
    type: ActionType
}

export enum ActionType {
    /**
     * Rest API
     */
    Rest,
    /**
     * 调用标准 API
     */
    API,
    /**
     * 抽屉弹窗
     */
    Drawer,
    /**
     * 模态弹窗
     */
    Modal,
    /**
     * 跳转页面
     */
    Digit
}