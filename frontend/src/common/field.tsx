import * as React from 'react'
import { ProSchema, ProSchemaComponentTypes, ProFormField, EditableFormInstance } from "@ant-design/pro-components";
import { Tag } from "antd";
import { Displayable, FieldInfo, LookupActionInfo, MainFieldComponent, PopupProps, CustomTagProps, EnumItem } from "../../types";
import { doLookupAction } from "./action";
import FastballPopup from "./components/Popup";
import FastballAddress from "./components/Address";
import { loadRefComponent } from './component';
import { getByPaths } from './utils';

const formOnlyField: Record<string, boolean> = {
    group: true, formList: true, formSet: true, divider: true, dependency: true,
}

const setDateRangeFieldProps = (column: ProSchema, fieldProps: Record<string, any>) => {
    column.valueType = 'dateRange'
    column.fieldProps = Object.assign(column.fieldProps || {}, fieldProps)
}

export const filterFormOnlyField = (field: FieldInfo) => formOnlyField[field.valueType] !== true

export const filterEnabled = (item: Displayable) => item.display !== 'Disabled'

export const filterVisibled = (item: Displayable) => item.display !== 'Disabled' && item.display !== 'Hidden'

export const processingField = (field: FieldInfo, column: ProSchema, parentDataIndex?: string[], __designMode?: string, editableFormRef?: React.RefObject<EditableFormInstance>) => {
    if (field.display === 'Hidden') {
        column.hideInForm = true;
        column.hideInDescriptions = true;
        column.hideInSearch = true;
        column.hideInTable = true;
    }
    if (field.valueType == 'multiSelect') {
        column.valueType = 'select'
        column.fieldProps = Object.assign(column.fieldProps || {}, { mode: "multiple" })
    } else if (field.valueType == 'dateWeekRange') {
        setDateRangeFieldProps(column, { picker: "week", format: "YYYY-WW" })
    } else if (field.valueType == 'dateMonthRange') {
        setDateRangeFieldProps(column, { picker: "month", format: "YYYY-MM" })
    } else if (field.valueType == 'dateQuarterRange') {
        setDateRangeFieldProps(column, { picker: "quarter", format: "YYYY-Q" })
    } else if (field.valueType == 'dateYearRange') {
        setDateRangeFieldProps(column, { picker: "year", format: "YYYY" })
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
            ...(column.fieldProps || {}),
            fieldNames: {
                label: lookupAction.labelField,
                value: lookupAction.valueField,
                children: lookupAction.childrenField
            }
        }
        if (field.valueType == 'treeSelect') {
            fieldProps.treeCheckable = lookupAction.multiple
        }
        if (lookupAction.multiple) {
            fieldProps.mode = "multiple";
        }
        if (lookupAction.extraFillFields.length > 0) {
            column.fieldProps = (formInstance, config) => {
                const { dataIndex, rowIndex, entity } = config;
                if (editableFormRef && rowIndex !== undefined) {
                    fieldProps.onSelect = (_selectedValue: any, selectedItem: Record<string, any>) => {
                        const rowData = editableFormRef.current?.getRowData?.(rowIndex) || {};
                        lookupAction.extraFillFields.forEach(({ fromField, targetField, onlyEmpty }) => {
                            if (rowData[targetField] === undefined || rowData[targetField] === null || !onlyEmpty) {
                                rowData[targetField] = selectedItem[fromField]
                            }
                        })
                        console.log('onSelect', rowIndex, rowData, parentDataIndex, config)
                        editableFormRef.current?.setRowData?.(rowIndex, rowData)
                        // editableFormRef.current?.resetFields
                    }
                } else if (formInstance) {
                    fieldProps.onSelect = (_selectedValue: any, selectedItem: Record<string, any>) => {
                        const rowData = formInstance.getFieldsValue?.() || {};
                        let record = rowData;
                        if (!!parentDataIndex?.length) {
                            record = getByPaths(rowData, parentDataIndex);
                        }
                        if(Array.isArray(record) && Number.isInteger(rowIndex)) {
                            record = record[rowIndex];
                        }
                        lookupAction.extraFillFields.forEach(({ fromField, targetField, onlyEmpty }) => {
                            if (record[targetField] === undefined || record[targetField] === null || !onlyEmpty) {
                                record[targetField] = selectedItem[fromField]
                            }
                        })
                        console.log('onSelect', dataIndex, rowIndex, rowData, parentDataIndex, config)
                        // formInstance.setFieldValue(dataIndex, record)
                        formInstance.setFieldsValue?.({ ...rowData })
                    }
                }
                return fieldProps;
            }
        } else {
            column.fieldProps = fieldProps
        }
        column.request = () => {
            return doLookupAction(lookupAction, undefined, __designMode);
        }
    }
    if (field.fieldType === 'popup' && field.popupInfo) {
        column.render = (dom, record, index, action?, schema?: ProSchema & { type: ProSchemaComponentTypes }) => {
            if (schema?.type === 'descriptions' && schema.valueType && ['select', 'treeSelect'].includes(schema.valueType.toString())) {
                const fieldConfig = {
                    ignoreFormItem: true,
                    valueEnum: schema.valueEnum,
                    valueType: schema.valueType,
                    fieldProps: schema.fieldProps,
                    params: schema.params,
                    request: schema.request,
                    text: dom,
                    renderFormItem: undefined,
                    record,
                }
                dom = <ProFormField mode="read" {...fieldConfig} />
            }
            const popupInfo = field.popupInfo!;
            const props: PopupProps = { trigger: <a>{dom}</a>, popupInfo }
            if (popupInfo.popupComponent.currentFieldInput) {
                props.input = getByPaths(record, field.dataIndex)
            } else {
                props.input = getByPaths(record, popupInfo.popupComponent.dataPath)
            }
            return <FastballPopup {...props} />;
        }
    }
    if (field.fieldType === 'component') {
        const { editModeComponent, displayModeComponent, dataIndex } = field;
        if (displayModeComponent) {
            column.render = (_, record) => {
                const refProps: Record<string, any> = { __designMode }
                if (displayModeComponent.currentFieldInput) {
                    refProps[displayModeComponent.propsKey] = getByPaths(record, dataIndex)
                } else {
                    refProps[displayModeComponent.propsKey] = getByPaths(record, displayModeComponent.dataPath)
                }
                return loadRefComponent(displayModeComponent.componentInfo, refProps);
            }
        }
        if (editModeComponent) {
            column.renderFormItem = (_, config) => {
                const refProps: Record<string, any> = { __designMode }
                if (editModeComponent.currentFieldInput) {
                    refProps[editModeComponent.propsKey] = config.value
                } else {
                    refProps[editModeComponent.propsKey] = getByPaths(config.record, editModeComponent.dataPath)
                }
                return loadRefComponent(editModeComponent.componentInfo, refProps);
            }
        }
    }
}