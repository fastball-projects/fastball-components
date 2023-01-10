import * as React from 'react'
import { BetaSchemaForm } from '@ant-design/pro-components'
import type { ProFormColumnsType, DrawerFormProps, ModalFormProps, FormInstance } from '@ant-design/pro-components';
import type { Data, FieldInfo, FormProps, LookupActionInfo, TreeLookupActionInfo } from '../../../types';
import { buildAction, doLookupAction, doApiAction, filterEnabled, filterVisibled } from '../../common';
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
        const fields: FieldInfo[] = this.props.fields;

        return fields.filter(filterEnabled).map(field => {
            const proTableColumn: ProFormColumnsType<Data> = {};
            Object.assign(proTableColumn, field, { hideInTable: true, hideInSetting: true });
            if (field.display === 'Hidden') {
                proTableColumn.hideInForm = true;
            }
            if (field.validationRules) {
                proTableColumn.formItemProps = {
                    rules: field.validationRules
                }
            }
            if (field.lookupAction) {
                let lookupAction: LookupActionInfo = field.lookupAction;
                proTableColumn.fieldProps = Object.assign(proTableColumn.fieldProps || {}, {
                    treeCheckable: lookupAction.multiple,
                    fieldNames: {
                        label: lookupAction.labelField,
                        value: lookupAction.valueField,
                        children: lookupAction.childrenField
                    }
                })
                proTableColumn.request = () => doLookupAction(lookupAction)
            }
            return proTableColumn;
        })
    }

    render(): React.ReactNode {
        const { componentKey, fields = [], actions = [], input, size = 'small', variableForm, setActions, ...props } = this.props;
        const proFormProps: ProFormProps = { size, grid: true, rowProps: { gutter: [16, 16] } };

        if (variableForm) {
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
