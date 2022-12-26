import * as React from 'react'
import { Modal, Drawer } from 'antd';
import { BetaSchemaForm } from '@ant-design/pro-components'
import type { ProFormColumnsType, DrawerFormProps, ModalFormProps, FormInstance } from '@ant-design/pro-components';
import type { Data, MockDataComponent, FormProps } from '../../../types';
import { buildAction } from '../../common';

type ProFormProps = React.ComponentProps<typeof BetaSchemaForm> & DrawerFormProps & ModalFormProps

const FastballForm: MockDataComponent<FormProps> = ({ trigger, componentKey, fields = [], actions = [], data, popupType, onClose, ...props }) => {
    const [visit, setVisit] = React.useState(false);
    const ref = React.useRef<FormInstance>();
    const proFormProps: ProFormProps = {};
    proFormProps.open = visit
    proFormProps.size = 'small'
    proFormProps.grid = true
    proFormProps.rowProps = { gutter: [16, 16] }
    proFormProps.initialValues = data

    const close = () => {
        setVisit(false);
        if (onClose) {
            onClose();
        }
    }

    const actionButtons = actions ? actions.filter(({ display }) => display !== false).map(action => {
        if (action.closeOnSuccess) {
            action.callback = close
        }
        return buildAction({ componentKey, ...action, loadData: () => ref.current?.getFieldsValue() });
    }) : []
    const columns: ProFormColumnsType<any, 'text'>[] = fields.filter(({ display }) => display !== false).map(field => {
        const proTableColumn: ProFormColumnsType<Data> = {};
        Object.assign(proTableColumn, field, { hideInTable: true, hideInSetting: true });
        return proTableColumn;
    })
    proFormProps.columns = columns;

    let PopupComponent: React.FC | React.ComponentClass | null = null;
    if (popupType === 'Drawer') {
        PopupComponent = Drawer
    } else if (popupType === 'Modal') {
        PopupComponent = Modal
    }
    proFormProps.submitter = PopupComponent ? false : { render: () => actionButtons }

    // if (trigger) {
    //     trigger.props.onClick = () => setVisit(true)
    // }

    const form = <BetaSchemaForm formRef={ref} {...proFormProps} {...props} />
    return (
        <>
            {trigger ? <div onClick={() => setVisit(true)}>{trigger}</div> : null}
            {PopupComponent ? <PopupComponent onCancel={close} open={visit} footer={actionButtons}>{form}</PopupComponent> : form}
        </>
    )
}

export default FastballForm;
