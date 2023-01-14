import * as React from 'react'
import { BetaSchemaForm, ProSchema } from '@ant-design/pro-components'
import type { ProFormColumnsType, DrawerFormProps, ModalFormProps, FormInstance } from '@ant-design/pro-components';
import type { Data, FieldInfo, FormProps } from '../../../types';
import { buildAction, doApiAction, filterEnabled, filterVisibled, processingField } from '../../common';
import { Button } from 'antd';

type ProFormProps = React.ComponentProps<typeof BetaSchemaForm> & DrawerFormProps & ModalFormProps

class FastballForm extends React.Component<FormProps, any> {
    ref = React.createRef<FormInstance>();

    constructor(props: FormProps) {
        super(props)

        // 第一次调用传入的 setActions 将按钮注册到 popup, 否则会导致循环更新
        if (props.setActions) {
            props.setActions(this.getActions())
        }
    }

    getActions() {
        const { componentKey, closePopup, showReset, input, actions } = this.props;
        const buttons = actions ? actions.filter(filterVisibled).map(action => {
            if (action.closePopupOnSuccess !== false && closePopup) {
                action.callback = () => {
                    this.ref.current?.resetFields()
                    closePopup()
                }
            }
            return buildAction({
                componentKey, ...action, loadData: async () => {
                    const data: Data = {}
                    const formData = await this.ref.current?.validateFields()
                    Object.assign(data, input, formData)
                    return [data];
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
        const { readonly } = this.props;
        return fields.filter(filterEnabled).filter(field => field.valueType).map(field => {
            const formColumn: ProFormColumnsType = {};
            Object.assign(formColumn, field);
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
            if (field.valueType === 'Array' && field.subFields) {
                formColumn.valueType = 'formList'
                const subFieldColumn: ProFormColumnsType = {};
                subFieldColumn.valueType = 'group'
                subFieldColumn.columns = this.buildColumns(field.subFields);
                formColumn.columns = [subFieldColumn]
                if (readonly ||field.readonly) {
                    formColumn.fieldProps = Object.assign(formColumn.fieldProps || {}, {
                        copyIconProps: false,
                        deleteIconProps: false,
                        creatorButtonProps: false
                    })
                }
            }
            return formColumn;
        })
    }

    render(): React.ReactNode {
        const { componentKey, fields = [], actions = [], input, size = 'small', variableForm, setActions, __designMode, ...props } = this.props;
        const proFormProps: ProFormProps = { size, grid: true, rowProps: { gutter: [16, 16] } };

        if (variableForm && __designMode !== 'design') {
            proFormProps.request = async () => await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', data: [input] })
        } else if (input) {
            proFormProps.initialValues = input
        }

        proFormProps.columns = this.getColumns();

        if (setActions) {
            proFormProps.submitter = false;
        } else {
            proFormProps.submitter = { render: () => this.getActions() }
        }

        return <BetaSchemaForm formRef={this.ref} {...proFormProps} {...props} />
    }
}

export default FastballForm;
