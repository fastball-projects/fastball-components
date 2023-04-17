import React, { useRef } from 'react'
import { ProTable } from '@ant-design/pro-components'
import type { ProTableProps, ProColumns, ActionType as AntDProActionType } from '@ant-design/pro-components'
import type { Data, MockDataComponent, TableProps, ColumnInfo, ActionInfo, FieldInfo } from '../../../types';
import { buildAction, doApiAction, loadRefComponent, filterEnabled, filterVisibled, processingField, filterFormOnlyField } from '../../common';
import { Button, Dropdown, MenuProps, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';

type ProTableColumn<ValueType = 'text'> = ProColumns<Data, ValueType>

const buildMockData = (columns: ColumnInfo[]) => {
    const record: Data = { recordActionAvailableFlags: {} };
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

const FastballTable: MockDataComponent<TableProps> = ({ onRecordClick, componentKey, size, queryFields, columns, actions = [], recordActions = [], input, rowExpandedComponent, childrenFieldName, wrappedSearch, keywordSearch, onDataLoad, __designMode, ...otherProps }) => {
    const ref = useRef<AntDProActionType>();
    const proTableProps: ProTableProps<Data, { keyWord?: string }> = { size, rowKey: 'id' };
    const proTableColumns: ProTableColumn[] = [];

    const buildTableColumns = (field: ColumnInfo, parentDataIndex?: string[]) => {
        if (field.valueType === 'Array') {
            return;
        }
        const column: ProTableColumn = {}
        Object.assign(column, field, { hideInSearch: true });
        processingField(field, column, __designMode);
        if (parentDataIndex) {
            column.dataIndex = [...parentDataIndex, ...field.dataIndex]
        }
        if (field.valueType === 'SubFields' && field.subFields) {
            field.subFields.forEach(subField => buildTableColumns(subField, field.dataIndex))
            return;
        }
        if (field.valueType === 'textarea') {
            column.ellipsis = true
        }
        column.sorter = field.sortable
        proTableColumns.push(column);
    }

    if (__designMode === 'design') {
        proTableProps.dataSource = buildMockData(columns);
    } else {
        proTableProps.request = async (params, sortFields, filter) => {
            const { pageSize, current, keyword, ...searchFields } = params
            const searchParam = { sortFields, pageSize, current, keyword };
            if (wrappedSearch) {
                const search = Object.assign({}, searchFields, filter);
                Object.assign(searchParam, { search });
            } else {
                Object.assign(searchParam, searchFields, filter);
            }
            const data = [searchParam, input]
            const result = await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', data })
            if (onDataLoad) {
                onDataLoad(result);
            }
            return result;
        }
    }

    columns.filter(filterEnabled).forEach(field => buildTableColumns(field));

    if (queryFields) {
        queryFields.filter(filterEnabled).forEach(field => {
            const proTableColumn: ProTableColumn = {};
            processingField(field, proTableColumn, __designMode);
            Object.assign(proTableColumn, field, { hideInTable: true, hideInSetting: true });
            proTableColumns.push(proTableColumn);
        });
    } else {
        proTableProps.search = false;
    }

    const actionButtons = !actions ? [] : actions.filter(filterVisibled).map(action => {
        const actionInfo: ActionInfo = { componentKey, ...action, data: input };
        if (action.refresh) {
            actionInfo.callback = () => ref.current?.reload()
        }
        return buildAction(actionInfo)
    })
    if (recordActions.length > 0) {
        proTableColumns.push({
            title: '操作',
            dataIndex: '__option',
            valueType: 'option',
            align: 'left',
            render: (_, record) => {
                const items: MenuProps['items'] = recordActions ? recordActions.filter(filterVisibled).map((action) => {
                    const { actionKey, actionName, refresh } = action;
                    const recordActionAvailableFlags = record.recordActionAvailableFlags as Record<string, boolean>
                    if (recordActionAvailableFlags && recordActionAvailableFlags[actionKey] === false) {
                        return null;
                    }

                    const trigger = <Button type='link'>{actionName || actionKey}</Button>
                    const actionInfo: ActionInfo = Object.assign({}, action, { trigger, componentKey, data: record });
                    if (refresh) {
                        actionInfo.callback = () => ref.current?.reload()
                    }
                    return { key: actionKey, label: buildAction(actionInfo) }
                }).filter(action => action != null) : [];
                
                return (
                    <Dropdown menu={{ items }}>
                        <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            操作
                            <DownOutlined />
                        </Space>
                        </a>
                    </Dropdown>
                )
            }
        })
    }

    proTableProps.columns = proTableColumns
    proTableProps.toolbar = { actions: actionButtons }
    proTableProps.options = {}
    if (keywordSearch) {
        proTableProps.options.search = true
    }

    proTableProps.expandable = {}

    if (rowExpandedComponent) {
        proTableProps.expandable.expandedRowRender = (record) => loadRefComponent(rowExpandedComponent, { input: record, __designMode })
    }

    if (childrenFieldName) {
        proTableProps.expandable.childrenColumnName = childrenFieldName
    } else {
        // antd 的 table 默认展开字段是 children, 暂时没找到关闭机制, 所以设置一个特殊值规避, 否则当 children 不是数组时, 会导致渲染挂掉
        proTableProps.expandable.childrenColumnName = "__Fastball__Children__Column__"
    }

    proTableProps.cardProps = false
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
