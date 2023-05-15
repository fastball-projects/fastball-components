import * as React from 'react'
import { BetaSchemaForm, EditableFormInstance, ProConfigProvider, ProForm, ProSchema, ProTable } from '@ant-design/pro-components'
import type { ProFormColumnsType, DrawerFormProps, ModalFormProps, ProFormInstance } from '@ant-design/pro-components';
import { ConditionComposeType, Data, FieldDependencyInfo, FieldInfo, FormFieldInfo, FormProps } from '../../../types';
import { buildAction, doApiAction, filterEnabled, filterVisibled, processingField } from '../../common';
import { Button, Upload, Image } from 'antd';
import SubTable from '../../common/components/SubTable';
import Address from '../../common/components/Address';
import { ComponentToPrint } from '../../common/components/Printer';


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
    valueChangeHandlerProcessing: boolean
}

class FastballForm extends React.Component<FormProps, FormState> {
    ref: React.RefObject<ProFormInstance>;
    componentRef = React.createRef();


    constructor(props: FormProps) {
        super(props)
        this.ref = props.formRef || React.createRef<ProFormInstance>()
        this.state = { valueChangeHandlerProcessing: false }
        // 第一次调用传入的 setActions 将按钮注册到 popup, 否则会导致循环更新
        if (props.setActions) {
            props.setActions(this.getActions())
        }
    }

    getActions() {
        const { componentKey, closePopup, showReset, input, actions, recordActions } = this.props;
        const buttons = recordActions ? recordActions.filter(filterVisibled).map(action => {
            action.callback = () => {
                this.ref.current?.resetFields()
                if (action.closePopupOnSuccess !== false && closePopup) {
                    closePopup()
                }
            }
            return buildAction({
                ref: this.componentRef,
                componentKey, ...action, needArrayWrapper: false, loadData: async () => {
                    const formData = await this.ref.current?.validateFieldsReturnFormatValue?.()
                    const data: Data = Object.assign({}, input, formData)
                    return [data, input];
                }
            });
        }) : []
        actions?.filter(filterVisibled).forEach(action => {
            action.callback = () => {
                this.ref.current?.resetFields()
                if (action.closePopupOnSuccess !== false && closePopup) {
                    closePopup()
                }
            }
            const button = buildAction({
                ref: this.componentRef,
                componentKey, ...action, needArrayWrapper: false, loadData: async () => {
                    const formData = await this.ref.current?.validateFieldsReturnFormatValue?.()
                    const data: Data = Object.assign({}, input, formData)
                    return [data, input];
                }
            });
            buttons.push(button);
        })
        if (showReset !== false) {
            buttons.push(<Button onClick={() => this.ref.current?.resetFields()}>重置</Button>)
        }
        return buttons;
    }

    getColumns(): ProFormColumnsType<any, 'text'>[] {
        return this.buildColumns(this.props.fields)
    }

    buildColumns(fields: FormFieldInfo[], parentDataIndex?: string[], editableFormRef?: React.RefObject<EditableFormInstance>): ProFormColumnsType<any, 'text'>[] {
        const { readonly, column } = this.props;
        const columnSpan = 24 / (column || 2);
        return fields.filter(filterEnabled).filter(field => field.valueType).map(field => {
            const formColumn: ProFormColumnsType = {};
            Object.assign(formColumn, field);
            formColumn.colProps = { span: field.entireRow ? 24 : columnSpan }
            processingField(field, formColumn as ProSchema, this.props.__designMode, editableFormRef);
            if (parentDataIndex) {
                formColumn.dataIndex = [...parentDataIndex, ...field.dataIndex]
            }
            formColumn.name = formColumn.dataIndex
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
                    columns: this.buildColumns(field.subFields, undefined, editableFormRef),
                    title: formColumn.title,
                    editableFormRef,
                })
                formColumn.title = null;
            }
            if (field.expression) {
                formColumn.dependencies = field.expression.fields;
                formColumn.formItemProps = (formInstance, { dataIndex, rowIndex }) => {
                    if (editableFormRef && rowIndex !== undefined) {
                        const rowData = editableFormRef.current?.getRowData?.(rowIndex) || {};
                        const value = eval(`({${field.expression.fields.join(", ")}}) => ${field.expression.expression};`)(rowData)
                        const dataPath = parentDataIndex || []
                        editableFormRef.current?.setFieldValue([...dataPath, rowIndex, dataIndex], value)
                        // editableFormRef.current?.setRowData?.(rowIndex, value)
                    } else if (formInstance) {
                        const rowData = formInstance.getFieldsValue?.() || {};
                        const newData = eval(`({${field.expression.fields.join(", ")}}) => ${field.expression.expression};`)(rowData)
                        formInstance.setFieldsValue?.(rowData)
                    }
                    return formColumn.formItemProps;
                }
            }
            if (field.valueType === 'Array' && field.subFields) {
                formColumn.valueType = 'formList'
                const subFieldColumn: ProFormColumnsType = {};
                subFieldColumn.valueType = 'group'
                subFieldColumn.columns = this.buildColumns(field.subFields);
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
                        title: formColumn.title, dataIndex: formColumn.dataIndex, valueType: 'dependency', name: dependencyFieldNames, columns: (values) => {
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
                    if (field.conditionComposeType === 'Or' && field.fieldDependencyInfoList?.find(fieldDependInfo => checkCondition(fieldDependInfo, values))) {
                        return true
                    } else if (!field.fieldDependencyInfoList?.find(fieldDependInfo => !checkCondition(fieldDependInfo, values))) {
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
        const proFormProps: ProFormProps = { size, grid: true, layout: "horizontal", rowProps: { gutter: [16, 16] } };

        if (variableForm && __designMode !== 'design') {
            proFormProps.request = async () => {
                const data = await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', needArrayWrapper: false, data: [input] })
                if (onDataLoad) {
                    onDataLoad(data);
                }
                return data;
            }
        } else if (input) {
            if (onDataLoad) {
                onDataLoad(input);
            }
            proFormProps.initialValues = input
        }

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
                    this.ref.current?.setFieldsValue({ ...data })
                }
            }

        }
        return (
            <ComponentToPrint ref={this.componentRef}>
                <ProConfigProvider
                    valueTypeMap={{
                        SubTable: {
                            render: (data, props) => {
                                return <SubTable size="small" {...props} {...props.fieldProps} readonly />
                            },
                            renderFormItem: (data, props) => {
                                return <SubTable size="small" {...props} {...props?.fieldProps} />
                            }
                        },
                        Address: {
                            render: (text) => text,
                            renderFormItem: (text, props, dom) => <Address {...props} {...props?.fieldProps} />
                        },
                        image: {
                            render: (text) => <Image src={text}></Image>,
                            renderFormItem: (item, props) => {
                                return (
                                    <ProForm.Item {...props} {...props?.fieldProps}>
                                        <Upload maxCount={1} />
                                    </ProForm.Item>
                                );
                            },
                        }
                    }}
                >
                    <BetaSchemaForm formRef={this.ref} {...proFormProps} {...props} />
                </ProConfigProvider>
            </ComponentToPrint>
        )
    }
}

export default FastballForm;
