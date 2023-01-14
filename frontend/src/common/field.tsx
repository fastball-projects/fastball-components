import * as React from 'react'
import { ProSchema } from "@ant-design/pro-components";
import { Select, Tag } from "antd";
import { Displayable, FieldInfo, LookupActionInfo, MainFieldComponent, PopupProps, CustomTagProps, EnumItem } from "../../types";
import { doLookupAction } from "./action";
import FastballPopup from "./components/Popup";
import { loadRefComponent } from './component';

const formOnlyField: Record<string, boolean> = {
    group: true, formList: true, formSet: true, divider: true, dependency: true,
}

export const filterFormOnlyField = (field: FieldInfo) => formOnlyField[field.valueType] !== true

export const filterEnabled = (item: Displayable) => item.display !== 'Disabled'

export const filterVisibled = (item: Displayable) => item.display !== 'Disabled' && item.display !== 'Hidden'

export const getByPaths = (record: Record<string, any>, dataPath: string[]) => {
    let temp: Record<string, any> = record;
    dataPath.forEach(path => {
        if (!temp) {
            return null;
        }
        temp = temp[path];
    })
    return temp;
}

export const processingField = (field: FieldInfo, column: ProSchema, __designMode?: string) => {
    if (field.display === 'Hidden') {
        column.hideInForm = true;
        column.hideInDescriptions = true;
        column.hideInSearch = true;
        column.hideInTable = true;
    }
    if (field.valueType == 'multiSelect') {
        column.valueType = 'select'
        column.fieldProps = Object.assign(column.fieldProps || {}, { mode: "multiple" })
    }
    if (field.valueType == 'select' || field.valueType == 'multiSelect') {
        const tagRender = ({ label, value, closable, onClose }: CustomTagProps) => (
            <Tag color={field.valueEnum?.[value]?.color} closable={closable} onClose={onClose}>
                {label}
            </Tag>
        )
        column.fieldProps = Object.assign(column.fieldProps || {}, { tagRender })
    }
    if (field.lookup) {
        const lookupAction: LookupActionInfo = field.lookup;
        const fieldProps = {
            treeCheckable: lookupAction.multiple,
            fieldNames: {
                label: lookupAction.labelField,
                value: lookupAction.valueField,
                children: lookupAction.childrenField
            }
        }
        if (lookupAction.multiple) {
            column.fieldProps = Object.assign(fieldProps, { mode: "multiple" })
        }
        column.fieldProps = Object.assign(column.fieldProps || {}, fieldProps)
        column.request = () => {
            return doLookupAction(lookupAction, undefined, __designMode);
        }
    }
    if (field.fieldType === 'popup' && field.popup) {
        column.render = (dom, record) => {
            const { popupTitle, popupComponent, popupType, triggerType, placementType, width, dataPath } = field.popup!;
            const props: PopupProps = { width, title: popupTitle, trigger: <a>{dom}</a>, popupComponent, popupType, triggerType, placementType }
            if (dataPath) {
                props.input = getByPaths(record, dataPath)
            } else {
                props.input = record;
            }
            return <FastballPopup {...props} />;
        }
    }
    if (field.fieldType === 'component') {
        const { editModeComponent, displayModeComponent, dataIndex } = field;
        if (displayModeComponent) {
            column.render = (value, record) => {
                const refProps: Record<string, any> = { __designMode }
                refProps[displayModeComponent.recordKey] = record
                // render 没有提供 value 的参数, 被换成了 Dom, 但是试了一下基本都还是 value, 否则只能叠加一下 field dataIndex 用 json path 取一下了
                refProps[displayModeComponent.valueKey] = value
                return loadRefComponent(displayModeComponent.componentInfo, refProps);
            }
        }
        if (editModeComponent) {
            column.renderFormItem = (_, config) => {
                const refProps: Record<string, any> = { __designMode }
                refProps[editModeComponent.valueKey] = config.value
                refProps[editModeComponent.recordKey] = config.record
                return loadRefComponent(editModeComponent.componentInfo, refProps);
            }
        }
    }
}