import * as React from 'react'
import { BetaSchemaForm, ProConfigProvider, ProSchema, ProTable } from '@ant-design/pro-components'
import type { ProFormColumnsType, DrawerFormProps, ModalFormProps, ProFormInstance } from '@ant-design/pro-components';
import type { Data, FieldInfo, FormProps } from '../../../types';
import { buildAction, doApiAction, filterEnabled, filterVisibled, processingField } from '../../common';
import { Button } from 'antd';
import SubTable from '../../common/components/SubTable';
import Address from '../../common/components/Address';

type ProFormProps = React.ComponentProps<typeof BetaSchemaForm> & DrawerFormProps & ModalFormProps

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
            if (action.closePopupOnSuccess !== false && closePopup) {
                action.callback = () => {
                    this.ref.current?.resetFields()
                    closePopup()
                }
            }
            return buildAction({
                componentKey, ...action, loadData: async () => {
                    const data: Data = {}
                    const formData = await this.ref.current?.validateFieldsReturnFormatValue?.()
                    Object.assign(data, input, formData)
                    return data;
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

    buildColumns(fields: FieldInfo[], parentDataIndex?: string[]): ProFormColumnsType<any, 'text'>[] {
        const { readonly, column } = this.props;
        const columnSpan = 24 / (column || 2);
        return fields.filter(filterEnabled).filter(field => field.valueType).map(field => {
            const formColumn: ProFormColumnsType = {};
            Object.assign(formColumn, field);
            formColumn.colProps = { span: field.entireRow ? 24 : columnSpan }
            processingField(field, formColumn as ProSchema, this.props.__designMode);
            if (parentDataIndex) {
                formColumn.dataIndex = [...parentDataIndex, ...field.dataIndex]
            }
            if (field.validationRules) {
                formColumn.formItemProps = Object.assign(formColumn.formItemProps || {}, {
                    rules: field.validationRules
                })
            }
            if (field.valueType === 'SubFields' && field.subFields) {
                formColumn.valueType = 'group'
                formColumn.columns = this.buildColumns(field.subFields, field.dataIndex)
            }
            if (field.valueType === 'SubTable' && field.subFields) {
                formColumn.fieldProps = Object.assign(formColumn.fieldProps || {}, {
                    columns: this.buildColumns(field.subFields)
                })
            }
            // if (field.valueType === 'Array' && field.subFields) {
            //     formColumn.valueType = 'formList'
            //     const subFieldColumn: ProFormColumnsType = {};
            //     subFieldColumn.valueType = 'group'
            //     subFieldColumn.columns = this.buildColumns(field.subFields);
            //     formColumn.columns = [subFieldColumn]
            //     if (readonly || field.readonly) {
            //         formColumn.fieldProps = Object.assign(formColumn.fieldProps || {}, {
            //             copyIconProps: false,
            //             deleteIconProps: false,
            //             creatorButtonProps: false
            //         })
            //     }
            // }
            return formColumn;
        })
    }

    render(): React.ReactNode {
        const { componentKey, input, size = 'small', variableForm, setActions, onDataLoad, __designMode, ...props } = this.props;
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

        return <ProConfigProvider
            valueTypeMap={{
                SubTable: {
                    render: (text, props) => <ProTable size="small" {...props} {...props?.fieldProps} />,
                    renderFormItem: (text, props) => <SubTable size="small" {...props} {...props?.fieldProps} />
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
