import * as React from 'react'
import { BetaSchemaForm } from '@ant-design/pro-components'
import type { ProFormColumnsType, DrawerFormProps, ModalFormProps, FormInstance } from '@ant-design/pro-components';
import type { Data, MockDataComponent, FormProps, ReactComponent } from '../../../types';
import { buildAction } from '../../common';
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
        const { componentKey, actions, closePopup, showReset } = this.props;
        const buttons = actions ? actions.filter(({ display }) => display !== false).map(action => {
            if (action.closeOnSuccess) {
                action.callback = closePopup
            }
            return buildAction({ componentKey, ...action, loadData: () => this.ref.current?.validateFields() });
        }) : []
        if (showReset !== false) {
            buttons.push(<Button onClick={() => this.ref.current?.resetFields()}>重置</Button>)
        }
        return buttons;
    }

    render(): React.ReactNode {
        const { componentKey, fields = [], actions = [], data, setActions, ...props } = this.props;

        const proFormProps: ProFormProps = {};
        proFormProps.size = 'small'
        proFormProps.grid = true
        proFormProps.rowProps = { gutter: [16, 16] }
        proFormProps.initialValues = data

        const columns: ProFormColumnsType<any, 'text'>[] = fields.filter(({ display }) => display !== false).map(field => {
            const proTableColumn: ProFormColumnsType<Data> = {};
            Object.assign(proTableColumn, field, { hideInTable: true, hideInSetting: true });
            if (field.validationRules) {
                proTableColumn.formItemProps = {
                    rules: field.validationRules
                }
            }
            return proTableColumn;
        })

        proFormProps.columns = columns;

        if (setActions) {
            proFormProps.submitter = false;
        } else {
            proFormProps.submitter = { render: () => this.getActions() }
        }

        return <BetaSchemaForm formRef={this.ref} {...proFormProps} {...props} />
    }
}

export default FastballForm;
