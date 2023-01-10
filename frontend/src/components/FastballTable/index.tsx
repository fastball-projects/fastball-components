import React, { useRef } from 'react'
import { ProTable } from '@ant-design/pro-components'
import type { ProTableProps, ProColumns, ActionType as AntDProActionType, ProConfigProvider } from '@ant-design/pro-components'
import type { Data, MockDataComponent, TableProps, ColumnInfo, LookupActionInfo, ActionInfo } from '../../../types';
import { buildAction, doApiAction, loadRefComponent, doLookupAction, filterEnabled, filterVisibled } from '../../common';
import { Button } from 'antd';
import FastballPopup from '../../common/Popup';

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


const FastballTable: MockDataComponent<TableProps> = ({ onRecordClick, componentKey, queryFields, columns, actions = [], recordActions = [], input, rowExpandedComponent, childrenFieldName, __designMode, ...otherProps }) => {
    const ref = useRef<AntDProActionType>();
    const proTableProps: ProTableProps<Data, Data> = { size: 'small', search: { filterType: 'light' }, rowKey: 'id' };
    const proTableColumns: ProTableColumn[] = [];

    if (__designMode === 'design') {
        proTableProps.dataSource = buildMockData(columns);
    } else {
        proTableProps.request = async (params, sortFields, filter) => {
            const data = [Object.assign({ sortFields }, filter, params), input]
            return await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', data })
        }
    }

    columns.filter(filterEnabled).forEach(column => {
        const proTableColumn: ProTableColumn = {}
        if (column.lookupAction) {
            const lookupAction: LookupActionInfo = column.lookupAction;
            proTableColumn.request = () => doLookupAction(lookupAction)
        }
        Object.assign(proTableColumn, column, { hideInForm: true, hideInSearch: true });
        if (column.display === 'Hidden') {
            proTableColumn.hideInTable = true;
            proTableColumn.hideInSetting = true;
        }
        if (column.valueType === 'popup' && column.popupInfo) {
            proTableColumn.render = (dom, record) => {
                const { popupTitle, popupComponent, popupType, placementType, width } = column.popupInfo!;
                return <FastballPopup width={width} title={popupTitle} trigger={<a>{dom}</a>} popupComponent={popupComponent} popupType={popupType} placementType={placementType} input={record} />;
            }
        }
        proTableColumns.push(proTableColumn);
    });

    if (queryFields) {
        queryFields.filter(filterEnabled).forEach(field => {
            const proTableColumn: ProTableColumn = {};
            if (field.lookupAction) {
                const lookupAction: LookupActionInfo = field.lookupAction;
                proTableColumn.request = () => doLookupAction(lookupAction)
            }
            Object.assign(proTableColumn, field, { hideInTable: true, hideInSetting: true });
            if (field.display === 'Hidden') {
                proTableColumn.hideInForm = true;
                proTableColumn.hideInSearch = true;
            }
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
                return recordActions ? recordActions.filter(filterVisibled).map((action) => {
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
        proTableProps.expandable.expandedRowRender = (record) => loadRefComponent(rowExpandedComponent, { input: record })
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
