import React, { useRef } from 'react'
import { ProTable } from '@ant-design/pro-components'
import type { ProTableProps, ProColumns, ActionType as AntDProActionType } from '@ant-design/pro-components'
import type { Data, MockDataComponent, TableProps } from '../../../types';
import { buildAction, doApiAction, loadRefComponent } from '../../common';

type ProTableColumn<ValueType = 'text'> = ProColumns<Data, ValueType>

const FastballTable: MockDataComponent<TableProps> = ({ componentKey, query, columns, actions = [], recordActions = [], rowExpandedComponent, __designMode, ...otherProps }) => {
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

    const actionButtons = !actions ? [] : actions.filter(({ display }) => display !== false).map(action => buildAction({ componentKey, ...action }))

    if (recordActions.length > 0) {
        proTableColumns.push({
            title: '操作',
            dataIndex: '__option',
            valueType: 'option',
            render: (_, record) => {
                return recordActions ? recordActions.filter(({ display }) => display !== false).map((action) => {
                    const { actionKey, actionName, type, refresh } = action;
                    const callback = () => {
                        if (refresh) {
                            ref.current?.reload()
                        }
                    }
                    return buildAction({ componentKey, ...action, callback, data: record })
                }) : [];
            }
        })
    }

    proTableProps.columns = proTableColumns
    proTableProps.toolBarRender = () => actionButtons

    if (rowExpandedComponent) {
        proTableProps.expandable = {
            expandedRowRender: (record) => loadRefComponent(rowExpandedComponent, { data: record })
        }
    }

    proTableProps.request = async (params, sort, filter) => {
        return await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', data: params })
    }

    return <ProTable
        actionRef={ref}
        {...proTableProps}
        {...otherProps} />
}


export default FastballTable;
