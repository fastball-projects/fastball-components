import React, { useRef } from 'react'
import { ProTable } from '@ant-design/pro-components'
import type { ProTableProps, ProColumns, ActionType as AntDProActionType } from '@ant-design/pro-components'
import type { Data, MockDataComponent, TableProps, ColumnInfo } from '../../../types';
import { buildAction, doApiAction, loadRefComponent } from '../../common';
import { Button } from 'antd';

type ProTableColumn<ValueType = 'text'> = ProColumns<Data, ValueType>

const buildMockData = (columns: ColumnInfo[]) => {
    const record: Data = {};
    columns.forEach(({ dataIndex, valueType }) => {
        if (valueType === 'digit') {
            record[dataIndex] = 9527
        } else if (valueType === 'text') {
            record[dataIndex] = 'Mock 文本'
        } else if (valueType === 'dateTime') {
            record[dataIndex] = Date.now()
        } else if (valueType === 'date') {
            record[dataIndex] = '2022-12-21'
        } else if (valueType === 'time') {
            record[dataIndex] = '18:12:21'
        }
    })
    return [record]
}


const FastballTable: MockDataComponent<TableProps> = ({ onRecordClick, componentKey, queryFields, columns, actions = [], recordActions = [], rowExpandedComponent, childrenFieldName, __designMode, query, ...otherProps }) => {
    const ref = useRef<AntDProActionType>();
    const proTableProps: ProTableProps<Data, Data> = {};
    const proTableColumns: ProTableColumn[] = [];

    if (__designMode === 'design') {
        proTableProps.dataSource = buildMockData(columns);
    } else {
        proTableProps.request = async (params, sort, filter) => {
            const data = Object.assign({}, params, query)
            return await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', data })
        }
    }

    columns.filter(({ display }) => display !== false).forEach(column => {
        const proTableColumn: ProTableColumn = {}
        Object.assign(proTableColumn, column, { hideInForm: true, hideInSearch: true });
        proTableColumns.push(proTableColumn);
    });

    if (queryFields) {
        queryFields.filter(({ display }) => display !== false).forEach(field => {
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
                    const trigger = <Button type='link'>{actionName || actionKey}</Button>
                    return buildAction({ trigger, componentKey, ...action, callback, data: record })
                }) : [];
            }
        })
    }

    proTableProps.columns = proTableColumns
    proTableProps.toolBarRender = () => actionButtons
    proTableProps.expandable = {}


    if (rowExpandedComponent) {
        proTableProps.expandable.expandedRowRender = (record) => loadRefComponent(rowExpandedComponent, { data: record })
    }


    if (childrenFieldName) {
        proTableProps.expandable.childrenColumnName = childrenFieldName
    } else {
        // antd 的 table 默认展开字段是 children, 暂时没找到关闭机制, 所以设置一个特殊值规避, 否则当 children 不是数组时, 会导致渲染挂掉
        proTableProps.expandable.childrenColumnName = "__Fastball__Children__Column__"
    }

    if (onRecordClick) {
        proTableProps.onRow = (record) => {
            return {
                onClick: () => {
                    onRecordClick(record)
                }
            };
        }
    }

    return <ProTable
        actionRef={ref}
        {...proTableProps}
        {...otherProps} />
}


export default FastballTable;
