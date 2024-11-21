import * as React from 'react'
import { ProSchema, ProSchemaComponentTypes, ProFormField, EditableFormInstance, ProColumns, ProConfigProvider, ProFormUploadButton, ProFormSelect, ProFormTreeSelect, ProFormDigit, ProFormTextArea, ProFormText, ProFieldFCRenderProps, ProField } from "@fastball/pro-components";
import { Tag, Image, ConfigProvider, Input, InputNumber } from "antd";
import { Displayable, FieldInfo, LookupActionInfo, PopupProps, CustomTagProps, ColumnInfo, Data, ReactComponent } from "../../types";
import { doLookupAction } from "./action";
import FastballPopup from "./components/Popup";
import { loadRefComponent } from './component';
import { getByPaths } from './utils';
import AutoComplete from './components/AutoComplete';
import { FC, useState } from 'react';
import RichText from './components/RichText';
import SubTable from './components/SubTable';
import FastballTableForm from '../components/FastballTableForm';
import Address from './components/Address';
import LookupComponent from './components/Lookup';
import TreeLookupComponent from './components/TreeLookup';
import { preview, upload } from './upload';

import { loadCache, setCache } from './cache';
import SelectComponent from './components/Select';
import { FastballViewPathKey } from './components/ViewWrapper';

const formOnlyField: Record<string, boolean> = {
    group: true, formList: true, formSet: true, divider: true, dependency: true,
}

const setDateRangeFieldProps = (column: ProSchema, fieldProps: Record<string, any>) => {
    column.valueType = 'dateRange'
    column.fieldProps = Object.assign(column.fieldProps || {}, fieldProps)
}

const OnBlurTriggerChangeModeInputNumberWrapper = (text: any, props: ProFieldFCRenderProps, dom: JSX.Element) => {
    const fieldProps = Object.assign({}, props?.fieldProps)
    const onBlur = fieldProps.onBlur
    fieldProps.onBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value)
        onBlur?.(event)
        props.fieldProps.onChange?.(value)
    }
    fieldProps.onChange = null
    return <InputNumber {...fieldProps} />
}

const OnBlurTriggerChangeModeInputWrapper = (component: any) =>
    (text: any, props: ProFieldFCRenderProps, dom: JSX.Element) => <FieldComponentWrapper component={component} {...props} />

const FieldComponentWrapper: FC<{ component: any } & ProFieldFCRenderProps> = ({ component, value, ...props }) => {
    const [fieldValue, setFieldValue] = useState(value)

    React.useEffect(() => {
        setFieldValue(value)
    }, [value])

    const [InputComponent] = useState(component)
    const fieldProps = Object.assign({}, props?.fieldProps)
    fieldProps.onBlur = () => {
        props.fieldProps.onChange?.(fieldValue)
    }
    fieldProps.onChange = (event: any) => {
        setFieldValue(event.target.value)
    }

    return <InputComponent {...fieldProps} value={fieldValue} />
}

type ProTableColumn<ValueType = 'text'> = ProColumns<Data, ValueType>

export const filterFormOnlyField = (field: FieldInfo) => formOnlyField[field.valueType] !== true

export const filterEnabled = (item: Displayable) => item.display !== 'Disabled'

export const filterVisibled = (item: Displayable) => item.display !== 'Disabled' && item.display !== 'Hidden'

export const processingField = (container: Element, componentKey: string, field: FieldInfo, column: ProSchema, parentDataIndex?: string[], __designMode?: string, editableFormRef?: React.RefObject<EditableFormInstance>) => {
    if (field.display === 'Hidden') {
        column.hideInForm = true;
        column.hideInDescriptions = true;
        column.hideInSearch = true;
        column.hideInTable = true;
    }

    const fieldViewPath = {
        [FastballViewPathKey]: JSON.stringify({
            type: 'Field',
            field: field.dataIndex,
        })
    }
    column.formItemProps = Object.assign(column.formItemProps || {}, fieldViewPath)

    if (parentDataIndex?.length) {
        column.cacheKey = parentDataIndex.join('.') + '.' + field.dataIndex.join('.')
    } else {
        column.cacheKey = field.dataIndex.join('.')
    }

    column.initialValue = field.defaultValue
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
            componentKey,
            proFieldKey: componentKey + "." + column.cacheKey,
            popupMatchSelectWidth: false,
            showSearch: lookupAction.showSearch,
            fieldNames: {
                label: lookupAction.labelField,
                value: lookupAction.valueField,
                children: lookupAction.childrenField
            },
            lookup: field.lookup
        }
        if (container) {
            fieldProps.getPopupContainer = () => container
        }
        if (!field.lookup.columns?.length && field.valueType == 'Lookup') {
            column.valueType = 'Select'
        }
        if (field.valueType == 'TreeLookup') {
            fieldProps.treeCheckable = lookupAction.multiple
        }
        if (lookupAction.multiple) {
            fieldProps.mode = "multiple";
        }
        fieldProps.colProps = null;
        if (lookupAction.extraFillFields && lookupAction.extraFillFields.length > 0) {
            column.fieldProps = (formInstance, config) => {
                const { dataIndex, rowIndex, entity } = config;
                if (editableFormRef && rowIndex !== undefined) {
                    fieldProps.onSelect = (_selectedValue: any, selectedItem: Record<string, any>) => {
                        const rowData = editableFormRef.current?.getRowData?.(rowIndex) || {};
                        lookupAction.extraFillFields.forEach(({ fromField, targetField, onlyEmpty }) => {
                            if (rowData[targetField] === undefined || rowData[targetField] === null || !onlyEmpty) {
                                rowData[targetField] = selectedItem?.[fromField]
                            }
                        })
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
                        if (Array.isArray(record) && Number.isInteger(rowIndex)) {
                            record = record[rowIndex];
                        }
                        lookupAction.extraFillFields.forEach(({ fromField, targetField, onlyEmpty }) => {
                            if (record[targetField] === undefined || record[targetField] === null || !onlyEmpty) {
                                record[targetField] = selectedItem?.[fromField]
                            }
                        })
                        // formInstance.setFieldValue(dataIndex, record)
                        formInstance.setFieldsValue?.({ ...rowData })
                    }
                }
                return fieldProps;
            }
        } else {
            column.fieldProps = fieldProps
        }

        if (lookupAction.dependencyParams?.length) {
            column.dependencies = lookupAction.dependencyParams.map(dependencyParam => dependencyParam.paramPath)
            column.params = (record, config) => {
                const search = {}
                const rootValues = config?.getRootValues?.()
                lookupAction.dependencyParams?.forEach(dependencyParam => {
                    if (dependencyParam.rootValue && rootValues) {
                        search[dependencyParam.paramKey] = getByPaths(rootValues, dependencyParam.paramPath)
                    } else {
                        search[dependencyParam.paramKey] = getByPaths(record, dependencyParam.paramPath)
                    }
                })
                return { search }
            }
            // } else {
            //     column.params = { timestamp: Math.random() }
        }

        column.request = async (params, props) => {
            const lookupCacheKey = 'lookup||' + lookupAction.lookupKey + '||' + JSON.stringify(params)
            const cachedOptions = loadCache(lookupCacheKey);
            if (cachedOptions != null) {
                return cachedOptions;
            }
            const lookupOptions = await doLookupAction(lookupAction, params, __designMode)
            setCache(lookupCacheKey, lookupOptions);
            return lookupOptions;
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
            const props: PopupProps = { trigger: <a className='fb-popup-trigger'>{dom}</a>, popupInfo }

            if (popupInfo.dynamicPopup) {
                props.input = record;
            } else if (popupInfo.popupComponent?.currentFieldInput) {
                props.input = getByPaths(record, field.dataIndex)
            } else if (popupInfo.popupComponent?.dataPath?.length) {
                props.input = getByPaths(record, popupInfo.popupComponent.dataPath)
            } else {
                props.input = record;
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

export const buildTableColumn = (container: Element, componentKey: string, proTableColumns: ProTableColumn[], field: ColumnInfo, parentDataIndex?: string[], __designMode?: boolean) => {
    if (field.valueType === 'Array') {
        return;
    }
    if (field.valueType === 'SubTable') {
        return;
    }
    if (field.valueType === 'RichText') {
        return;
    }
    if (field.valueType === 'MultiAttachment') {
        return;
    }
    const column: ProTableColumn = {}

    const fieldViewPath = {
        [FastballViewPathKey]: JSON.stringify({
            type: 'Field',
            field: field.dataIndex,
        })
    }
    Object.assign(column, field, {
        hideInSearch: true,
        'RC_TABLE_INTERNAL_COL_DEFINE': fieldViewPath
    });
    processingField(container, componentKey, field, column, __designMode);
    if (parentDataIndex) {
        column.dataIndex = [...parentDataIndex, ...field.dataIndex]
    }
    if (field.valueType === 'SubFields' && field.subFields) {
        field.subFields.forEach(subField => buildTableColumn(container, componentKey, proTableColumns, subField, field.dataIndex))
        return;
    }
    if (field.valueType === 'Textarea') {
        column.ellipsis = true
    }
    if (field.width) {
        column.width = field.width
    }
    if (field.valueType === 'Attachment') {
        column.width = 120;
    }
    column.sorter = field.sortable
    return column;
}

export const buildTableColumns = (container: Element, componentKey: string, proTableColumns: ProTableColumn[], columns?: ColumnInfo[], queryFields?: FieldInfo[], __designMode?: string) => {
    columns?.filter(filterEnabled).map(field => buildTableColumn(container, componentKey, proTableColumns, field)).filter(Boolean).forEach(field => proTableColumns.push(field));

    queryFields?.filter(filterEnabled).forEach(field => {
        const proTableColumn: ProTableColumn = {};
        Object.assign(proTableColumn, field, { hideInTable: true, hideInSetting: true });
        processingField(container, componentKey, field, proTableColumn, null, __designMode);
        proTableColumns.push(proTableColumn);
    });
}

interface FastballFieldProviderProps {
    children: React.ReactNode
    container?: HTMLElement
}

export const FastballFieldProvider: FC<FastballFieldProviderProps> = ({ children, container }) => {
    const getPopupContainer = container ? () => container : undefined;
    return <ProConfigProvider
        valueTypeMap={{
            Text: {
                render: (text) => <ProField text={text} valueType="text" mode="read" />,
                renderFormItem: OnBlurTriggerChangeModeInputWrapper(Input)
            },
            Textarea: {
                render: (text) => <ProField text={text} valueType="textarea" mode="read" />,
                renderFormItem: OnBlurTriggerChangeModeInputWrapper(Input.TextArea)
            },
            Digit: {
                render: (text) => <ProField text={text} valueType="digit" mode="read" />,
                renderFormItem: OnBlurTriggerChangeModeInputNumberWrapper
            },
            SubTable: {
                render: (data, props) => {
                    const name = Number.isInteger(props.rowIndex) ? [props.rowIndex, ...props.fieldProps.name] : props.fieldProps.name
                    return <SubTable size="small" {...props} {...props.fieldProps} name={name} readonly />
                },
                renderFormItem: (data, props, dom) => {
                    const name = Number.isInteger(props.rowIndex) ? [props.rowIndex, ...props.fieldProps.name] : props.fieldProps.name
                    return <SubTable size="small" {...props} {...props?.fieldProps} name={name} />
                }
            },
            TableForm: {
                render: (data, props) => {
                    return <FastballTableForm {...props} {...props.fieldProps} readonly />
                },
                renderFormItem: (data, props) => {
                    return <FastballTableForm {...props} {...props?.fieldProps} />
                }
            },
            Address: {
                render: (value, props) => <Address {...props} {...props?.fieldProps} value={value} readonly />,
                renderFormItem: (text, props, dom) => <Address {...props} {...props?.fieldProps} />
            },
            Lookup: {
                render: (value, props) => <ProFormSelect {...props} {...props?.fieldProps} value={value} readonly />,
                renderFormItem: (text, props, dom) => {
                    return <LookupComponent {...props} {...props?.fieldProps} />
                }
            },
            Select: {
                render: (value, props) => <ProFormSelect {...props} {...props?.fieldProps} value={value} readonly />,
                renderFormItem: (text, props, dom) => {
                    return <SelectComponent {...props} {...props?.fieldProps} />
                }
            },
            TreeLookup: {
                render: (value, props) => <ProFormTreeSelect {...props} {...props?.fieldProps} value={value} mode={null} readonly />,
                renderFormItem: (text, props, dom) => <ProFormTreeSelect {...props} {...props?.fieldProps} mode={null} />
            },
            AutoComplete: {
                render: (text) => text,
                renderFormItem: (value, props, dom) => <AutoComplete {...props} {...props?.fieldProps} value={value} />
            },
            RichText: {
                render: (text) => <RichText {...props} {...props?.fieldProps} readOnly />,
                renderFormItem: (text, props, dom) => <RichText {...props} {...props?.fieldProps} />
            },
            Attachment: {
                render: (value) => {
                    return <Image width={104} src={value?.url} />
                },
                renderFormItem: (value, props) => {
                    const fieldProps = Object.assign({}, props?.fieldProps)
                    fieldProps.customRequest = upload;
                    fieldProps.previewFile = preview;
                    fieldProps.multiple = true;
                    fieldProps.listType = 'picture-card';
                    fieldProps.onChange = (values) => {
                        props?.fieldProps?.onChange?.(values.fileList[0])
                    }
                    const name = Number.isInteger(props.rowIndex) ? [props.rowIndex, ...props.fieldProps.name] : props.fieldProps.name
                    const fieldValue = value ? [value] : []
                    return <ProFormUploadButton max={1} {...props} name={name} fieldProps={fieldProps} value={fieldValue} />
                }
            },
            MultiAttachment: {
                render: (value, props) => {
                    const name = Number.isInteger(props.rowIndex) ? [props.rowIndex, ...props.fieldProps.name] : props.fieldProps.name
                    const fieldValue = Array.isArray(value) ? value : value.fileList
                    const fieldProps = { showUploadList: { showRemoveIcon: false } }
                    return <ProFormUploadButton {...props} name={name} value={fieldValue} fieldProps={fieldProps} readonly />
                },
                renderFormItem: (value, props) => {
                    const fieldProps = Object.assign({}, props?.fieldProps)
                    fieldProps.customRequest = upload;
                    fieldProps.previewFile = preview;
                    fieldProps.multiple = true;
                    fieldProps.listType = 'picture-card';
                    fieldProps.onChange = (values) => {
                        props?.fieldProps?.onChange?.(values.fileList)
                    }
                    const name = Number.isInteger(props.rowIndex) ? [props.rowIndex, ...props.fieldProps.name] : props.fieldProps.name
                    const fieldValue = Array.isArray(value) ? value : value.fileList
                    return <ProFormUploadButton {...props} name={name} fieldProps={fieldProps} value={fieldValue} />
                }
            }
        }}
    >
        <ConfigProvider getPopupContainer={getPopupContainer}>
            {children}
        </ConfigProvider>
    </ProConfigProvider>
}