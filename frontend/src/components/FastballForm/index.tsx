import * as React from 'react'
import { EditableFormInstance, ProSchema, ProCard } from '@fastball/pro-components'
import { BetaSchemaForm } from '@fastball/pro-components';
import type { ProFormColumnsType, DrawerFormProps, ModalFormProps, ProFormInstance } from '@fastball/pro-components';
import { Data, FieldDependencyInfo, FormFieldInfo, FormProps } from '../../../types';
import { FastballFieldProvider, buildAction, doApiAction, filterEnabled, filterVisibled, getByPaths, processingField, setByPaths } from '../../common';
import { Button, Spin } from 'antd';
import dayjs from 'dayjs';
import { EDIT_ID } from '../../common/components/SubTable';
import { ComponentToPrint } from '../../common/components/Printer';
import { useContext } from 'react';
import { FastballContext } from '../FastballContext';

dayjs.extend((option, dayjsClass, dayjsFactory) => {
    dayjsClass.prototype.toJSON = function () {
        return this.format("YYYY-MM-DD HH:mm:ss")
    }
})

type ProFormProps = React.ComponentProps<typeof BetaSchemaForm> & DrawerFormProps & ModalFormProps

const checkCondition = (fieldDependencyInfo: FieldDependencyInfo, values: any): boolean => {
    if (fieldDependencyInfo.condition === 'Empty') {
        return !values[fieldDependencyInfo.field];
    }
    if (fieldDependencyInfo.condition === 'NotEmpty') {
        return !!values[fieldDependencyInfo.field];
    }
    if (!values || !values[fieldDependencyInfo.field]) {
        return false;
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

const buildGetParent = (formInstance: ProFormInstance, parentDataPath?: string[]) => (level?: number) => {
    if (!parentDataPath) {
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
const fieldChangeFunc = (field: FormFieldInfo, config: ProSchema<any>, formInstance: ProFormInstance, editableFormRef?: EditableFormInstance, parentDataPath?: string[]) => {
    const { dataIndex, rowIndex } = config;
    if (editableFormRef && rowIndex !== undefined) {
        const rowData = editableFormRef.current?.getRowData?.(rowIndex);
        if (!rowData) {
            return;
        }
        const value = eval(`($$getParent, {${field.expression.fields.join(", ")}}) => ${field.expression.expression};`)(buildGetParent(formInstance, parentDataPath), rowData);
        if (getByPaths(rowData, dataIndex) !== value) {
            setByPaths(rowData, dataIndex, value);
            editableFormRef.current?.setRowData?.(rowIndex, rowData);
        }
        // const dataPath = [rowIndex, ...dataIndex]
        // editableFormRef.current?.setFieldValue(dataPath, value)
    } else if (formInstance) {
        const rowData = formInstance.getFieldsValue?.() || {};
        const value = eval(`($$getParent, {${field.expression.fields.join(", ")}}) => ${field.expression.expression};`)(buildGetParent(formInstance, parentDataPath), rowData);
        if (getByPaths(rowData, dataIndex) !== value) {
            setByPaths(rowData, dataIndex, value);
            formInstance.setFieldsValue?.(rowData);
        }
    }
}

const fieldChangeTimerMap: Record<string, any> = {}

class FastballForm extends React.Component<FormProps, FormState> {
    static contextType = FastballContext;

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
        return this.buildColumns(this.props.componentKey, this.props.fields)
    }

    buildColumns(componentKey: string, fields: FormFieldInfo[], parentDataIndex?: string[], parentDataPath?: string[], editableFormRef?: React.RefObject<EditableFormInstance>, ignoreParentDataIndex?: boolean): ProFormColumnsType<any, 'text'>[] {
        const { readonly, column } = this.props;
        
        let container = this.props.container;
        if(!container) {
            container = this.context?.container;
        }
        
        const columnSpan = 24 / (column || 2);
        const getRootValues = () => this.formRef.current?.getFieldsValue()
        return fields.filter(filterEnabled).filter(field => field.valueType).sort((f1, f2) => f1.order - f2.order).map(field => {
            const formColumn: ProFormColumnsType = {};
            const parentPath = (Array.isArray(parentDataPath) ? [...parentDataPath] : []).concat(field.dataIndex)
            Object.assign(formColumn, { ...field, parentPath, getRootValues });
            formColumn['@class'] = null;
            formColumn.fieldProps = Object.assign(formColumn.fieldProps || {}, {
                parentPath,
            })
            formColumn.colProps = { span: field.entireRow ? 24 : columnSpan }
            processingField(container, componentKey, field, formColumn as ProSchema, parentDataIndex, this.props.__designMode, editableFormRef);
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
                    precision: field.digitPrecision || 2
                })
            }
            if (!readonly && (field.valueType === 'dateTime' || field.valueType === 'date')) {
                formColumn.initialValue = dayjs()
            }
            if (field.valueType === 'SubFields' && field.subFields) {
                formColumn.valueType = 'group'
                formColumn.columns = this.buildColumns(componentKey, field.subFields, field.dataIndex, parentPath)
            }
            if (field.valueType === 'SubTable' && field.subFields) {
                const editableFormRef = React.createRef<EditableFormInstance>()
                formColumn.fieldProps = Object.assign(formColumn.fieldProps || {}, {
                    columns: this.buildColumns(componentKey, field.subFields, field.dataIndex, parentPath, editableFormRef, true),
                    title: formColumn.title,
                    name: formColumn.name,
                    parentName: parentDataIndex,
                    editableFormRef,
                    recordActions: field.subTableRecordActions,
                    creatorButtonText: field.subTableCreatorButtonText
                })
                formColumn.initialValue = []
                formColumn.title = null;
            }
            if (field.autoComplete) {
                if (field.autoComplete.dependencyFields?.length) {
                    formColumn.dependencies = field.autoComplete.dependencyFields
                    formColumn.fieldProps = (formInstance, config): any => {
                        const { rowIndex } = config;
                        let input;
                        if (editableFormRef && rowIndex !== undefined) {
                            const rowData = editableFormRef.current?.getRowData?.(rowIndex);
                            input = rowData
                        } else if (formInstance) {
                            if (parentDataPath) {
                                input = formInstance.getFieldValue?.(parentDataPath) || {};
                            } else {
                                input = formInstance.getFieldsValue?.() || {};
                            }
                        }
                        return Object.assign(formColumn.fieldProps || {}, field.autoComplete, { input });
                    }
                } else {
                    formColumn.fieldProps = Object.assign(formColumn.fieldProps || {}, field.autoComplete)
                }
            }
            if (field.expression) {
                formColumn.dependencies = field.expression.fields;
                formColumn.formItemProps = (formInstance, config): any => {
                    const fieldKey = `${parentDataPath?.join('.')}:${config.rowIndex}:${field.dataIndex.join('.')}`
                    clearTimeout(fieldChangeTimerMap[fieldKey])
                    fieldChangeTimerMap[fieldKey] = setTimeout(() => fieldChangeFunc(field, config, formInstance, editableFormRef, parentDataPath), 300);
                    return config.formItemProps;
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
                        return this.buildColumns(componentKey, field.subFields!, field.dataIndex, parentPath, undefined, true).map(c => {
                            c.rowIndex = groupFieldProps.rowIndex;
                            return c;
                        })
                    }
                    const groupColumns = getGroupColumns(config);
                    return groupColumns;
                };
                if (field.subTableCreatorButtonText) {
                    formColumn.fieldProps = Object.assign(formColumn.fieldProps || {}, {
                        creatorButtonProps: {
                            creatorButtonText: field.subTableCreatorButtonText
                        }
                    })
                }
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
                    const dependencyFieldNames = field.fieldDependencyInfoList.map((fieldDependencyInfo) => {
                        if (parentDataPath?.length) {
                            return [...parentDataPath, fieldDependencyInfo.field];
                        }
                        return fieldDependencyInfo.field;
                    });
                    const dependencyField: ProFormColumnsType = {
                        title: formColumn.title, valueType: 'dependency', name: dependencyFieldNames, columns: (originValues) => {
                            const values = parentDataPath?.length ? getByPaths(originValues, parentDataPath) : originValues;
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
        const container = this.context?.container;
        const proFormProps: ProFormProps = { size, grid: true, layout: "horizontal", rowProps: { gutter: [16, 16] }, scrollToFirstError: true };

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
                <FastballFieldProvider container={container}>
                    <BetaSchemaForm formRef={this.formRef} {...proFormProps} {...props} />
                </FastballFieldProvider>
            </ComponentToPrint>
        )
    }
}

export default FastballForm;
