import { FieldInfo, ActionInfo, PopupComponent } from './common'
import { LowcodeComponentProps } from './component'

export type FormProps = {
    headerTitle?: string
    showReset: boolean
    fields: FieldInfo[]
    actions?: ActionInfo[]
    data?: Data
    initialValues?: Data
} & LowcodeComponentProps & PopupComponentProps
