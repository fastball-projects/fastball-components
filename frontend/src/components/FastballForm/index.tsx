import * as React from 'react'
import { BetaSchemaForm, EditableFormInstance, ProConfigProvider, ProForm, ProFormUploadButton, ProFormUploadDragger, ProSchema, ProCard } from '@ant-design/pro-components'
import type { ProFormColumnsType, DrawerFormProps, ModalFormProps, ProFormInstance } from '@ant-design/pro-components';
import { ConditionComposeType, Data, FieldDependencyInfo, FieldInfo, FormFieldInfo, FormProps } from '../../../types';
import { buildAction, doApiAction, filterEnabled, filterVisibled, getByPaths, processingField, setByPaths } from '../../common';
import { Button, Upload, Image, Spin } from 'antd';
import SubTable, { EDIT_ID } from '../../common/components/SubTable';
import Address from '../../common/components/Address';
import { ComponentToPrint } from '../../common/components/Printer';
import FastballTableForm from '../FastballTableForm';
import { preview, upload } from '../../common/upload';
import RichText from '../../common/components/RichText';
import AutoComplete from '../../common/components/AutoComplete';


type ProFormProps = React.ComponentProps<typeof BetaSchemaForm> & DrawerFormProps & ModalFormProps

const checkCondition = (fieldDependencyInfo: FieldDependencyInfo, values: any): boolean => {
    if (fieldDependencyInfo.condition === 'Empty') {
        return !values[fieldDependencyInfo.field];
    }
    if (fieldDependencyInfo.condition === 'NotEmpty') {
        return !!values[fieldDependencyInfo.field];
    }
    if (fieldDependencyInfo.condition === 'Equals') {
        return values[fieldDependencyInfo.field] == fieldDependencyInfo.value;
    }
    if (fieldDependencyInfo.condition === 'NotEquals') {
        return values[fieldDependencyInfo.field] != fieldDependencyInfo.value;
    }
    if (fieldDependencyInfo.condition === 'GreaterThan') {
        return values[fieldDependencyInfo.field] > fieldDependencyInfo.value;
    }
    if (fieldDependencyInfo.condition === 'GreaterThanOrEquals') {
        return values[fieldDependencyInfo.field] >= fieldDependencyInfo.value;
    }
    if (fieldDependencyInfo.condition === 'LessThan') {
        return values[fieldDependencyInfo.field] < fieldDependencyInfo.value;
    }
    if (fieldDependencyInfo.condition === 'LessThanOrEquals') {
        return values[fieldDependencyInfo.field] <= fieldDependencyInfo.value;
    }
    return false;
}

type FormState = {
    valueChangeHandlerProcessing: boolean,
    dataSource: Data[] | null,
}

class FastballForm extends React.Component<FormProps, FormState> {
    formRef: React.RefObject<ProFormInstance>;
    componentRef = React.createRef();

    constructor(props: FormProps) {
        super(props)
        this.formRef = props.formRef || React.createRef<ProFormInstance>()
        this.state = { valueChangeHandlerProcessing: false, dataSource: null }
        // 第一次调用传入的 setActions 将按钮注册到 popup, 否则会导致循环更新
        if (props.setActions) {
            props.setActions(this.getActions())
        }
    }

    // shouldComponentUpdate(nextProps: Readonly<FormProps>, nextState: Readonly<FormState>, nextContext: any): boolean {
    //     return Object.keys(nextProps).filter(k => nextProps[k] !== this.props[k]).length > 0
    // }

    getActions() {
        const { componentKey, closePopup, showReset, input, actions, recordActions } = this.props;
        const buttons = recordActions ? recordActions.filter(filterVisibled).map(action => {
            action.callback = () => {
                this.formRef.current?.resetFields?.()
                if (action.closePopupOnSuccess !== false && closePopup) {
                    closePopup()
                }
            }
            return buildAction({
                ref: this.componentRef,
                componentKey, ...action, needArrayWrapper: false, loadData: async () => {
                    await this.formRef.current?.validateFields?.()
                    // const formData = await this.formRef.current?.validateFieldsReturnFormatValue?.()
                    const formData = await this.formRef.current?.getFieldsValue?.()
                    const data: Data = Object.assign({}, input, this.state.dataSource, formData)
                    return [data, input];
                }, loadInput: () => {
                    // const formData = await this.formRef.current?.validateFieldsReturnFormatValue?.()
                    const formData = this.formRef.current?.getFieldsValue?.()
                    const data: Data = Object.assign({}, input, this.state.dataSource, formData)
                    return data;
                }
            });
        }) : []
        actions?.filter(filterVisibled).forEach(action => {
            action.callback = () => {
                this.formRef.current?.resetFields()
                if (action.closePopupOnSuccess !== false && closePopup) {
                    closePopup()
                }
            }
            const button = buildAction({
                ref: this.componentRef,
                componentKey, ...action, needArrayWrapper: false, loadData: async () => {
                    // const formData = await this.formRef.current?.validateFieldsReturnFormatValue?.()
                    await this.formRef.current?.validateFields?.()
                    const formData = await this.formRef.current?.getFieldsValue?.()
                    const data: Data = Object.assign({}, input, this.state.dataSource, formData)
                    return [data, input];
                }, loadInput: async () => {
                    await this.formRef.current?.validateFields?.()
                    // const formData = await this.formRef.current?.validateFieldsReturnFormatValue?.()
                    const formData = await this.formRef.current?.getFieldsValue?.()
                    const data: Data = Object.assign({}, input, this.state.dataSource, formData)
                    return data;
                }
            });
            buttons.push(button);
        })
        if (showReset !== false) {
            buttons.push(<Button onClick={() => this.formRef.current?.resetFields()}>重置</Button>)
        }
        return buttons;
    }

    getColumns(): ProFormColumnsType<any, 'text'>[] {
        return this.buildColumns(this.props.fields)
    }

    buildColumns(fields: FormFieldInfo[], parentDataIndex?: string[], parentDataPath?: string[], editableFormRef?: React.RefObject<EditableFormInstance>, ignoreParentDataIndex?: boolean): ProFormColumnsType<any, 'text'>[] {
        const { readonly, column } = this.props;
        const columnSpan = 24 / (column || 2);
        const getRootValues = () => this.formRef.current?.getFieldsValue()
        return fields.filter(filterEnabled).filter(field => field.valueType).map(field => {
            const formColumn: ProFormColumnsType = {};
            const parentPath = (Array.isArray(parentDataPath) ? [...parentDataPath] : []).concat(field.dataIndex)
            Object.assign(formColumn, { ...field, parentPath, getRootValues });
            formColumn['@class'] = null;
            formColumn.fieldProps = Object.assign(formColumn.fieldProps || {}, {
                parentPath,
            })
            formColumn.colProps = { span: field.entireRow ? 24 : columnSpan }
            processingField(field, formColumn as ProSchema, parentDataIndex, this.props.__designMode, editableFormRef);
            if (!ignoreParentDataIndex && parentDataIndex) {
                formColumn.dataIndex = [...parentDataIndex, ...field.dataIndex]
            }
            formColumn.name = formColumn.dataIndex
            if (typeof formColumn.fieldProps !== 'function') {
                formColumn.fieldProps = Object.assign(formColumn.fieldProps || {}, {
                    name: formColumn.dataIndex,
                })
            }
            if (field.validationRules) {
                formColumn.formItemProps = Object.assign(formColumn.formItemProps || {}, {
                    rules: field.validationRules
                })
            }
            if (field.valueType === 'digit') {
                formColumn.fieldProps = Object.assign(formColumn.formItemProps || {}, {
                    style: { width: '100%' }
                })
            }
            if (field.valueType === 'SubFields' && field.subFields) {
                formColumn.valueType = 'group'
                formColumn.columns = this.buildColumns(field.subFields, field.dataIndex)
            }
            if (field.valueType === 'SubTable' && field.subFields) {
                const editableFormRef = React.createRef<EditableFormInstance>()
                formColumn.fieldProps = Object.assign(formColumn.fieldProps || {}, {
                    columns: this.buildColumns(field.subFields, field.dataIndex, parentPath, editableFormRef, true),
                    title: formColumn.title,
                    name: formColumn.name,
                    parentName: parentDataIndex,
                    editableFormRef,
                    recordActions: field.subTableRecordActions
                })
                formColumn.initialValue = []
                formColumn.title = null;
            }
            if (field.expression) {
                formColumn.dependencies = field.expression.fields;
                formColumn.formItemProps = (formInstance, config): any => {
                    const getParent = (level?: number) => {
                        if ( !parentDataPath) {
                            return formInstance.getFieldsValue();
                        }
                        let parentLevel = level;
                        if (!parentLevel) {
                            return formInstance.getFieldValue(parentDataPath || []);

                        }
                        if (parentLevel < 0 || parentDataPath.length < parentLevel) {
                            return formInstance.getFieldsValue();
                        }
                        return formInstance.getFieldValue(parentDataPath.slice(0, parentDataPath.length - parentLevel));
                    };
                    const { dataIndex, rowIndex } = config;
                    if (editableFormRef && rowIndex !== undefined) {
                        const rowData = editableFormRef.current?.getRowData?.(rowIndex);
                        if (!rowData) {
                            return;
                        }
                        const value = eval(`($$getParent, {${field.expression.fields.join(", ")}}) => ${field.expression.expression};`)(getParent, rowData);
                        if (getByPaths(rowData, dataIndex) !== value) {
                            setByPaths(rowData, dataIndex, value);
                            editableFormRef.current?.setRowData?.(rowIndex, rowData);
                        }
                        // const dataPath = [rowIndex, ...dataIndex]
                        // editableFormRef.current?.setFieldValue(dataPath, value)
                    } else if (formInstance) {
                        const rowData = formInstance.getFieldsValue?.() || {};
                        const value = eval(`($$getParent, {${field.expression.fields.join(", ")}}) => ${field.expression.expression};`)(getParent, rowData);
                        if (getByPaths(rowData, dataIndex) !== value) {
                            setByPaths(rowData, dataIndex, value);
                            formInstance.setFieldsValue?.(rowData);
                        }
                    }
                    return formColumn.formItemProps;
                }
            }
            if (field.valueType === 'Array' && field.subFields) {
                formColumn.valueType = 'formList'
                formColumn.formItemProps = {
                    itemRender: ({ listDom, action }, { index }) => <ProCard
                        bordered title={`${field.title || ''} - ${index + 1}`} style={{ marginBlockEnd: 8 }} extra={action}
                    >{listDom}</ProCard>
                }
                const subFieldColumn: ProFormColumnsType = {};

                subFieldColumn.valueType = 'group'
                subFieldColumn.columns = (config) => {
                    const getGroupColumns = (groupFieldProps: any) => {
                        const parentPath = (Array.isArray(parentDataPath) ? [...parentDataPath] : []).concat(field.dataIndex).concat(groupFieldProps.rowIndex)
                        return this.buildColumns(field.subFields!, field.dataIndex, parentPath, undefined, true).map(c => {
                            c.rowIndex = groupFieldProps.rowIndex;
                            return c;
                        })
                    }
                    const groupColumns = getGroupColumns(config);
                    return groupColumns;
                };
                formColumn.columns = [subFieldColumn]
                if (readonly || field.readonly) {
                    formColumn.fieldProps = Object.assign(formColumn.fieldProps || {}, {
                        copyIconProps: false,
                        deleteIconProps: false,
                        creatorButtonProps: false
                    })
                }
            }
            // FIXME 这代码简直了....
            if (field.fieldDependencyInfoList && field.fieldDependencyInfoList.length > 0) {
                if (!editableFormRef) {
                    const dependencyFieldNames = field.fieldDependencyInfoList.map(({ field }) => field);
                    const dependencyField: ProFormColumnsType = {
                        title: formColumn.title, valueType: 'dependency', name: dependencyFieldNames, columns: (values) => {
                            if (field.conditionComposeType === 'Or' && field.fieldDependencyInfoList?.find(fieldDependInfo => checkCondition(fieldDependInfo, values))) {
                                return [{ ...formColumn }]
                            } else if (!field.fieldDependencyInfoList?.find(fieldDependInfo => !checkCondition(fieldDependInfo, values))) {
                                return [{ ...formColumn }]
                            }
                            if (field.fieldDependencyType === 'Readonly') {
                                return [{ ...formColumn, readonly: true }]
                            }
                            return [];
                        },
                    };
                    return dependencyField;
                }
                formColumn.editable = (text, values) => {
                    let record = values;
                    if (editableFormRef && values[EDIT_ID] !== undefined && values[EDIT_ID] !== null) {
                        record = editableFormRef?.current?.getRowData?.(values[EDIT_ID]) || values
                    }
                    if (field.conditionComposeType === 'Or' && field.fieldDependencyInfoList?.find(fieldDependInfo => checkCondition(fieldDependInfo, record))) {
                        return true
                    } else if (!field.fieldDependencyInfoList?.find(fieldDependInfo => !checkCondition(fieldDependInfo, record))) {
                        return true
                    }
                    return false
                }
            }
            return formColumn;
        })
    }

    render(): React.ReactNode {
        const { componentKey, input, size = 'small', variableForm, setActions, onDataLoad, valueChangeHandlers, __designMode, ...props } = this.props;
        props['@class'] = null;
        const { dataSource } = this.state;
        const proFormProps: ProFormProps = { size, grid: true, layout: "horizontal", rowProps: { gutter: [16, 16] } };

        if (variableForm && __designMode !== 'design') {
            if (dataSource == null) {
                const loadData = async () => {
                    const data = await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', needArrayWrapper: false, data: [input] })
                    if (onDataLoad) {
                        onDataLoad(data);
                    }
                    this.setState({ dataSource: data || [] })
                }

                loadData();
                return <Spin />
            }
            proFormProps.initialValues = dataSource
        } else if (input) {
            if (onDataLoad) {
                onDataLoad(input);
            }
            proFormProps.initialValues = input
        }
        // if (variableForm && __designMode !== 'design') {
        //     proFormProps.request = async () => {
        //         const data = await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', needArrayWrapper: false, data: [input] })
        //         if (onDataLoad) {
        //             onDataLoad(data);
        //         }
        //         return data;
        //     }
        // } else if (input) {
        //     if (onDataLoad) {
        //         onDataLoad(input);
        //     }
        //     proFormProps.initialValues = input
        // }

        proFormProps.columns = this.getColumns();

        if (setActions) {
            proFormProps.submitter = false;
        } else {
            proFormProps.submitter = { render: () => this.getActions() }
        }
        if (valueChangeHandlers && valueChangeHandlers.length > 0) {
            proFormProps.onValuesChange = async (change, values) => {
                const changeFields = Object.keys(change)
                const handler = valueChangeHandlers.find(({ watchFields }) => changeFields.find(changeField => watchFields.includes(changeField)))
                if (handler) {
                    const data = await doApiAction({ componentKey, type: 'API', actionKey: handler.handlerKey, data: [values] })
                    this.formRef.current?.setFieldsValue({ ...data })
                }
            }

        }
        return (
            <ComponentToPrint ref={this.componentRef}>
                <ProConfigProvider
                    valueTypeMap={{
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
                        AutoComplete: {
                            render: (text) => text,
                            renderFormItem: (text, props, dom) => <AutoComplete {...props} {...props?.fieldProps} input={props?.record} />
                        },
                        RichText: {
                            render: (text) => <RichText {...props} {...props?.fieldProps} readOnly />,
                            renderFormItem: (text, props, dom) => <RichText {...props} {...props?.fieldProps} />
                        },
                        Attachment: {
                            render: (value) => {
                                return <Image src={value?.url} />
                            },
                            renderFormItem: (value, props) => {
                                const fieldProps = Object.assign({}, props?.fieldProps)
                                fieldProps.customRequest = upload;
                                fieldProps.previewFile = preview;
                                fieldProps.multiple = true;
                                fieldProps.listType = 'picture-card';
                                fieldProps.onChange = (values) => {
                                    console.log('onChange', values)
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
                                    console.log('onChange', values)
                                    props?.fieldProps?.onChange?.(values.fileList)
                                }
                                const name = Number.isInteger(props.rowIndex) ? [props.rowIndex, ...props.fieldProps.name] : props.fieldProps.name
                                const fieldValue = Array.isArray(value) ? value : value.fileList
                                return <ProFormUploadButton {...props} name={name} fieldProps={fieldProps} value={fieldValue} />
                            }
                        }
                    }}
                >
                    <BetaSchemaForm formRef={this.formRef} {...proFormProps} {...props} />
                </ProConfigProvider>
            </ComponentToPrint>
        )
    }
}

export default FastballForm;
