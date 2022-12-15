import React, { useRef } from 'react'
import { ProTable } from '@ant-design/pro-components'
import type { ProTableProps, ProColumns, ActionType as AntDProActionType } from '@ant-design/pro-components'
import { Button } from 'antd';
import type { Data, MockDataComponent, TableProps } from '../../../types';
import { doAction, doApiAction } from '../../common';

type ProTableColumn<ValueType = 'text'> = ProColumns<Data, ValueType>

const FastballTable: MockDataComponent<TableProps> = ({ componentKey, query, columns, actions = [], recordActions = [], __designMode, ...otherProps }) => {
    const ref = useRef<AntDProActionType>();
    const proTableProps: ProTableProps<Data, Data> = {};
    const proTableColumns: ProTableColumn[] = [];

    columns.filter(({ display }) => display !== false).forEach(column => {
        const proTableColumn: ProTableColumn = {}
        Object.assign(proTableColumn, column, { hideInForm: true, hideInSearch: true });
        proTableColumns.push(proTableColumn);
    });

    if (query) {
        query.filter(({ display }) => display !== false).forEach(field => {
            const proTableColumn: ProTableColumn = {};
            Object.assign(proTableColumn, field, { hideInTable: true, hideInSetting: true });
            proTableColumns.push(proTableColumn);
        });
    }
    
    const actionButtons = !actions ? [] : actions.filter(({ display }) => display !== false).map(action => (
        <Button onClick={() => doAction(action)}>
            {action.actionName}
        </Button>
    ))

    if (recordActions.length > 0) {
        proTableColumns.push({
            title: '操作',
            dataIndex: '__option',
            valueType: 'option',
            render: (_, record) => {
                return recordActions ? recordActions.filter(({ display }) => display !== false).map((action) => {
                    const { actionKey, actionName, refresh } = action;
                    const execute = async () => {
                        const res = await doAction({ componentKey, ...action }, [record])
                        if (refresh) {
                            ref.current?.reload()
                        }
                    }
                    return (<Button key={actionKey} type="link" onClick={execute}>{actionName || actionKey}</Button>)
                }) : [];
            }
        })
    }



    proTableProps.columns = proTableColumns
    proTableProps.toolBarRender = () => actionButtons
    proTableProps.request = async (params, sort, filter) => {
        return await doApiAction({ componentKey, type: 'API', actionKey: 'loadData' }, [params])
    }

    return <ProTable
        actionRef={ref}
        {...proTableProps}
        {...otherProps} />
}


export default FastballTable;
