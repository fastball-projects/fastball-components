import * as React from 'react'
import { Button } from 'antd';
import { BetaSchemaForm, FooterToolbar } from '@ant-design/pro-components'
import type { ProFormColumnsType } from '@ant-design/pro-components';
import type { Data, MockDataComponent, FormProps } from '../../../types';

type ProFormProps = React.ComponentProps<typeof BetaSchemaForm>

const FastballForm: MockDataComponent<FormProps> = ({ fields = [], actions = [], ...props }) => {
    const proFormProps: ProFormProps = {};

    const actionButtons = actions ? actions.filter(({ display }) => display !== false).map(action => (
        <Button type="default" onClick={() => console.log(action.type)}>
            {action.actionName}
        </Button>
    )) : []
    proFormProps.size = 'small'
    proFormProps.grid = true
    proFormProps.rowProps = { gutter: [16, 16] }
    proFormProps.submitter = { render: () => <FooterToolbar>{actionButtons}</FooterToolbar> }
    const columns: ProFormColumnsType<any, 'text'>[] = fields.filter(({ display }) => display !== false).map(field => {
        const proTableColumn: ProFormColumnsType<Data> = {};
        Object.assign(proTableColumn, field, { hideInTable: true, hideInSetting: true });
        return proTableColumn;
    })
    proFormProps.columns = columns;

    return <BetaSchemaForm
        {...proFormProps}
        {...props} />
}

export default FastballForm;
