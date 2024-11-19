import React, { useContext, useRef, useState } from 'react'
import { ProTable } from '@fastball/pro-components';
import type { ProTableProps, ProColumns, ActionType as AntDProActionType } from '@fastball/pro-components'
import type { Data, MockDataComponent, TableProps, ColumnInfo, ActionInfo, ApiActionInfo } from '../../../types';
import { buildAction, doApiAction, loadRefComponent, filterVisibled, buildTableColumns, FastballFieldProvider } from '../../common';
import { Dropdown, MenuProps, Space, Table } from 'antd';
import { DownOutlined, MenuOutlined, MoreOutlined } from '@ant-design/icons';
import { FastballContext, FastballContextProvider } from '../FastballContext';
import ViewWrapper from '../../common/components/ViewWrapper';

type ProTableColumn<ValueType = 'text'> = ProColumns<Data, ValueType>

const buildMockData = (columns: ColumnInfo[]) => {
    const record: Data = { recordActionAvailableFlags: {} };
    columns.forEach(({ dataIndex, valueType }) => {
        if (valueType === 'Digit') {
            record[dataIndex] = 9527
        } else if (valueType === 'Text') {
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

const FastballTable: MockDataComponent<TableProps> = ({ container, onRecordClick, componentKey, size, lightQuery, pageable, showRowIndex, searchable, queryFields, columns, actions = [], recordActions = [], selectionActions = [], selectionViewActions = [], input, value, rowExpandedComponent, childrenFieldName, wrappedSearch, keywordSearch, onDataLoad, __designMode, ...otherProps }) => {
    const ref = useRef<AntDProActionType>();
    const proTableProps: ProTableProps<Data, { keyWord?: string }> = { size, tableLayout: 'fixed', rowKey: 'id', search: { labelWidth: "auto", filterType: lightQuery ? 'light' : 'query' } };
    const proTableColumns: ProTableColumn[] = [];
    const [searchState, setSearchState] = useState({});
    const [summaryFields, setSummaryFields] = useState([]);

    if (!container) {
        container = useContext(FastballContext)?.container
    }

    if (__designMode === 'design') {
        proTableProps.dataSource = buildMockData(columns);
    } else {
        proTableProps.request = async (params, sortFields, filter) => {
            let data;
            if (searchable) {
                const { pageSize, current, keyword, ...searchFields } = params
                const searchParam = { sortFields, pageSize, current, keyword };
                if (wrappedSearch) {
                    const search = Object.assign({}, searchFields, filter);
                    Object.assign(searchParam, { search });
                } else {
                    Object.assign(searchParam, searchFields, filter);
                }
                setSearchState(searchParam);
                data = [searchParam, input || value]
            } else {
                data = [input || value]
            }
            const result = await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', data })
            if (onDataLoad) {
                onDataLoad(result);
            }
            if (result.summaryFields?.length) {
                setSummaryFields(result.summaryFields)
            }
            return result;
        }
    }

    if (showRowIndex) {
        proTableColumns.push({
            title: '序号',
            dataIndex: '__row_index',
            readonly: true,
            renderText: (_dom, _entity, index, { pageInfo }) => {
                if (!pageInfo) {
                    return index + 1;
                }
                return (pageInfo.current - 1) * pageInfo.pageSize + index + 1
            }
        })
    }

    buildTableColumns(container, componentKey, proTableColumns, columns, queryFields, __designMode)

    if (!queryFields?.length) {
        proTableProps.search = false;
    }

    const actionButtons = actions?.filter(filterVisibled)?.map(action => {
        const actionInfo: ActionInfo = { componentKey, ...action };
        if (actionInfo.type === 'API') {
            const apiActionInfo = actionInfo as ApiActionInfo
            apiActionInfo.needArrayWrapper = false;
            apiActionInfo.data = [searchState, input || value]
        } else {
            actionInfo.data = input || value
        }
        if (action.refresh) {
            actionInfo.callback = () => ref.current?.reload()
        }
        return buildAction(actionInfo)
    })

    if (((selectionActions?.length || 0) + (selectionViewActions?.length || 0)) > 0) {
        proTableProps.rowSelection = {
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
            defaultSelectedRowKeys: [],
        }
        proTableProps.tableAlertOptionRender = ({ selectedRows }) => {
            const multipleSelectionActions = selectionActions?.map(action => {
                const { actionKey, actionName, refresh } = action;
                const trigger = <a style={{ display: "block" }}>{actionName || actionKey}</a>
                const actionInfo: ActionInfo = Object.assign({}, action, { trigger, componentKey, data: selectedRows });
                if (refresh) {
                    actionInfo.callback = () => ref.current?.reload()
                }
                return buildAction(actionInfo)
            }) || []
            selectionViewActions?.forEach(action => {
                const { actionKey, actionName, refresh } = action;
                const trigger = <a style={{ display: "block" }}>{actionName || actionKey}</a>
                const actionInfo: ActionInfo = Object.assign({}, action, { trigger, componentKey, data: selectedRows });
                if (refresh) {
                    actionInfo.callback = () => ref.current?.reload()
                }
                multipleSelectionActions.push(buildAction(actionInfo))
            })
            return (
                <Space size={16}>
                    {multipleSelectionActions}
                </Space>
            );
        }
    }

    const activedRecordActions = recordActions?.filter(filterVisibled)

    if (activedRecordActions?.length) {
        proTableColumns.push({
            title: '操作',
            dataIndex: '__option',
            valueType: 'option',
            align: 'left',
            width: 100,
            render: (_, record) => {
                const actionButtons = activedRecordActions.map((action) => {
                    const { actionKey, actionName, refresh } = action;
                    const recordActionAvailableFlags = record.recordActionAvailableFlags as Record<string, boolean>
                    if (recordActionAvailableFlags && recordActionAvailableFlags[actionKey] === false) {
                        return null;
                    }

                    const trigger = <a style={{ display: "block" }}>{actionName || actionKey}</a>
                    const actionInfo: ActionInfo = Object.assign({}, action, { trigger, componentKey, data: record });
                    if (refresh) {
                        actionInfo.callback = () => ref.current?.reload()
                    }
                    return buildAction(actionInfo)
                }).filter(action => action != null)

                if (actionButtons.length < 3) {
                    return actionButtons
                }

                const firstAction = actionButtons.shift()
                const items: MenuProps['items'] = actionButtons.map((action, i) => ({ key: i, label: action }));
                return <Space size={16}>
                    {firstAction}
                    <Dropdown menu={{ items }}>
                        <a onClick={(e) => e.preventDefault()}>
                            <MenuOutlined />
                        </a>
                    </Dropdown>
                </Space>
            }
        })
    }

    proTableProps.columns = proTableColumns
    proTableProps.toolbar = { actions: actionButtons }
    if (keywordSearch) {
        proTableProps.options = { search: true }
    } else {
        proTableProps.options = false
    }


    proTableProps.rowClassName = (record, index) => {
        let className = "light-row";
        if (index % 2 === 1) className = "dark-row";
        return className;
    }

    proTableProps.expandable = {}

    if (summaryFields?.length) {
        proTableProps.summary = () => {
            const cells = summaryFields.map(({ index, colSpan, value }) => <Table.Summary.Cell index={index} colSpan={colSpan}>{value}</Table.Summary.Cell>)
            return <Table.Summary.Row>{cells}</Table.Summary.Row>
        }
    }



    if (!pageable) {
        proTableProps.pagination = false
    }

    if (rowExpandedComponent) {
        proTableProps.expandable.expandedRowRender = (record) => {
            const component = loadRefComponent(rowExpandedComponent, { input: record, __designMode });
            return <div class="row-expanded-component">{component}</div>
        }
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

    const fastballViewPath = {
        componentKey,
        componentType: 'FastballTable',
        type: 'Component',
    }

    return <FastballFieldProvider container={container}>
        <ViewWrapper fastballViewPath={fastballViewPath}>
            <ProTable actionRef={ref} {...proTableProps} {...otherProps} />
        </ViewWrapper>
    </FastballFieldProvider>
}


export default FastballTable;
