import * as React from 'react'
import { BetaSchemaForm, ProConfigProvider, ProSchema, ProTable } from '@ant-design/pro-components'
import type { ProFormColumnsType, DrawerFormProps, ModalFormProps, ProFormInstance } from '@ant-design/pro-components';
import { ConditionComposeType, Data, FieldDependencyInfo, FieldInfo, FormFieldInfo, FormProps } from '../../../types';
import { buildAction, doApiAction, filterEnabled, filterVisibled, processingField } from '../../common';
import { Button } from 'antd';
import SubTable from '../../common/components/SubTable';
import Address from '../../common/components/Address';

type ProFormProps = React.ComponentProps<typeof BetaSchemaForm> & DrawerFormProps & ModalFormProps

const checkCondition = (fieldDependencyInfo: FieldDependencyInfo, values: any): boolean => {
    if (fieldDependencyInfo.condition === 'Empty') {
        return !values[fieldDependencyInfo.field];
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

class FastballForm extends React.Component<FormProps, any> {
    ref = React.createRef<ProFormInstance>();

    constructor(props: FormProps) {
        super(props)

        // 第一次调用传入的 setActions 将按钮注册到 popup, 否则会导致循环更新
        if (props.setActions) {
            props.setActions(this.getActions())
        }
    }

    getActions() {
        const { componentKey, closePopup, showReset, input, recordActions } = this.props;
        const buttons = recordActions ? recordActions.filter(filterVisibled).map(action => {
            action.callback = () => {
                this.ref.current?.resetFields()
                if (action.closePopupOnSuccess !== false && closePopup) {
                    closePopup()
                }
            }
            return buildAction({
                componentKey, ...action, needArrayWrapper: false, loadData: async () => {
                    const formData = await this.ref.current?.validateFieldsReturnFormatValue?.()
                    const data: Data = Object.assign({}, formData)
                    return [data, input];
                }
            });
        }) : []
        if (showReset !== false) {
            buttons.push(<Button onClick={() => this.ref.current?.resetFields()}>重置</Button>)
        }
        return buttons;
    }

    getColumns(): ProFormColumnsType<any, 'text'>[] {
        return this.buildColumns(this.props.fields)
    }

    buildColumns(fields: FormFieldInfo[], parentDataIndex?: string[], tableColumns?: boolean): ProFormColumnsType<any, 'text'>[] {
        const { readonly, column } = this.props;
        const columnSpan = 24 / (column || 2);
        return fields.filter(filterEnabled).filter(field => field.valueType).map(field => {
            const formColumn: ProFormColumnsType = {};
            Object.assign(formColumn, field);
            formColumn.colProps = { span: field.entireRow ? 24 : columnSpan }
            formColumn.name = formColumn.dataIndex
            processingField(field, formColumn as ProSchema, this.props.__designMode);
            if (parentDataIndex) {
                formColumn.dataIndex = [...parentDataIndex, ...field.dataIndex]
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
                formColumn.fieldProps = Object.assign(formColumn.fieldProps || {}, {
                    columns: this.buildColumns(field.subFields, undefined, true),
                    title: formColumn.title
                })
                formColumn.title = null;
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
                if (!tableColumns) {
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
                const data = await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', data: [input] })
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
        return <ProConfigProvider
            valueTypeMap={{
                SubTable: {
                    render: (data, props) => {
                        console.log(data, props)
                        return <SubTable size="small" {...props} {...props.fieldProps} readonly />
                    },
                    renderFormItem: (data, props) => {
                        console.log(data, props)
                        return <SubTable size="small" {...props} {...props?.fieldProps} />
                    }
                },
                Address: {
                    render: (text) => text,
                    renderFormItem: (text, props, dom) => <Address {...props} {...props?.fieldProps} />
                }
            }}
        >
            <BetaSchemaForm formRef={this.ref} {...proFormProps} {...props} />
        </ProConfigProvider>
    }
}

export default FastballForm;
