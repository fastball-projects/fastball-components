import React, { useRef } from 'react'
import { ProTable } from '@ant-design/pro-components'
import type { ProTableProps, ProColumns, ActionType as AntDProActionType } from '@ant-design/pro-components'
import { Button } from 'antd';
import type { Data, MockDataComponent, TableProps } from '../../../types';
import { doAction } from '../../common';

type ProTableColumn<ValueType = 'text'> = ProColumns<Data, ValueType>

const FastballTable: MockDataComponent<TableProps> = ({ componentKey, query, columns, actions = [], recordActions = [], __designMode, ...otherProps }) => {
    const ref = useRef<AntDProActionType>();
    const proTableProps: ProTableProps<Data, Data> = {};
    const proTableColumns: ProTableColumn[] = [];

    columns.filter(({ display }) => display).map(column => {
        const proTableColumn: ProTableColumn = {}
        Object.assign(column, proTableColumn, { hideInForm: true, hideInSearch: true });
        proTableColumns.push(proTableColumn);
    });

    if (query) {
        query.filter(({ display }) => display).map(field => {
            const proTableColumn: ProTableColumn = {}
            Object.assign(field, proTableColumn, { hideInForm: true, hideInSearch: true });
            proTableColumns.push(proTableColumn);
        });
    }
    
    const actionButtons = !actions ? [] : actions.filter(({ display }) => display).map(action => (
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
                return recordActions ? recordActions.filter(({ display }) => display).map((action) => {
                    const { actionKey, actionName, refresh } = action;
                    const execute = async () => {
                        const res = await doAction({ componentKey, ...action }, [record])
                        console.log(`do ${actionKey} done`, res, refresh)
                        if (refresh) {
                            console.log('refresh')
                            ref.current?.reload()
                        }
                    }
                    return (<a key={actionKey} onClick={execute}>{actionName || actionKey}</a>)
                }) : [];
            }
        })
    }



    proTableProps.columns = proTableColumns
    proTableProps.toolBarRender = () => actionButtons
    proTableProps.request = async (params, sort, filter) => {
        console.log('do table request', params, sort, filter)
        const resp = await fetch(`/api/fastball/frontend/component/${componentKey}/action/loadData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([params])
        })
        return await resp.json();
    }

    return <ProTable
        actionRef={ref}
        {...proTableProps}
        {...otherProps} />
}


export default FastballTable;
