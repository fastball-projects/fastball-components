import * as React from 'react'
import { BetaSchemaForm } from '@ant-design/pro-components'
import type { ProFormColumnsType, DrawerFormProps, ModalFormProps, FormInstance } from '@ant-design/pro-components';
import type { ActionInfo, Data, FieldInfo, FormProps, LookupActionInfo } from '../../../types';
import { buildAction, doLookupAction } from '../../common';
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
        const { componentKey, closePopup, showReset, input } = this.props;
        const actions: ActionInfo[] = this.props.actions;
        const buttons = actions ? actions.filter(({ display }) => display !== false).map(action => {
            if (action.closeOnSuccess !== false) {
                action.callback = closePopup
            }
            return buildAction({
                componentKey, ...action, loadData: async () => {
                    const data: Data = {}
                    const formData = await this.ref.current?.validateFields()
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
        const fields: FieldInfo[] = this.props.fields;

        return fields.filter(({ display }) => display !== false).map(field => {
            const proTableColumn: ProFormColumnsType<Data> = {};
            Object.assign(proTableColumn, field, { hideInTable: true, hideInSetting: true });
            if (field.validationRules) {
                proTableColumn.formItemProps = {
                    rules: field.validationRules
                }
            }
            if (field.lookupAction) {
                const lookupAction: LookupActionInfo = field.lookupAction;
                proTableColumn.request = () => doLookupAction(lookupAction)
            }
            return proTableColumn;
        })
    }

    render(): React.ReactNode {
        const { componentKey, fields = [], actions = [], input, setActions, ...props } = this.props;

        const proFormProps: ProFormProps = {};
        proFormProps.size = 'small'
        proFormProps.grid = true
        proFormProps.rowProps = { gutter: [16, 16] }
        if (input) {
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
