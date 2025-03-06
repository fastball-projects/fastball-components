import { EditableFormInstance, ProColumns, RowEditableConfig } from '@fastball/pro-components'
import { EditableProTable } from '@fastball/pro-components'
import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { ActionInfo, Data } from '../../../types';
import { buildAction } from '../action';
import { filterVisibled } from '../field';
import { getByPaths, setByPaths } from '../utils';

export const EDIT_ID = '__edit_id'

const buildEditableConfig = (
    editableKeys: React.Key[],
    name?: string,
    parentName?: string | string[],
    recordActions?: ActionInfo[],
    editableFormRef?: React.RefObject<EditableFormInstance>,
    readonly?: boolean,
    onChange?: (
        value: readonly Record<string, any>[],
    ) => void
): RowEditableConfig<Record<string, any>> => {
    if (readonly) {
        return {}
    }
    const deleteItem = (record?: Data) => () => {
        const formValue = editableFormRef?.current?.getFieldsValue();
        if (!formValue) {
            return;
        }
        let dataIndex: string[] = [];
        if (parentName?.length) {
            dataIndex = [...parentName]
        }
        if (Array.isArray(name)) {
            dataIndex = [...dataIndex, ...name]
        } else if (name) {
            dataIndex.push(name);
        }
        const tableDataSource = getByPaths(formValue, dataIndex)
        setByPaths(formValue, dataIndex, tableDataSource.filter((item: Record<string, any>) => item[EDIT_ID] !== record?.[EDIT_ID]))
        console.log(tableDataSource, formValue, dataIndex)
        editableFormRef?.current?.setFieldsValue(formValue);
    }
    return {
        type: 'multiple',
        editableKeys,
        actionRender: (record, config, defaultDoms) => recordActions ? recordActions.filter(filterVisibled).map((action) => {
            const { actionKey, actionName, refresh } = action;
            const recordActionAvailableFlags = record.recordActionAvailableFlags as Record<string, boolean>
            if (recordActionAvailableFlags && recordActionAvailableFlags[actionKey] === false) {
                return null;
            }
            const trigger = <a>{actionName || actionKey}</a>
            const actionInfo: ActionInfo = Object.assign({}, action, { trigger, data: record });
            const actionComponent = buildAction(actionInfo)
            if (actionComponent) {
                return { key: actionKey, label: actionComponent }
            }
            return null
        }).filter(action => action != null) : [
            <a key="delete" onClick={deleteItem(record)}>删除</a>,
        ],
        onValuesChange: (record, recordList) => {
            onChange?.(recordList);
        },
    }
}

const buildTableColumns = (columns: ProColumns[], recordActions?: ActionInfo[], readonly?: boolean) => {
    const tableColumns: ProColumns[] = [{
        title: '序号',
        dataIndex: '__row_index',
        readonly: true,
        width: 44,
        renderText: (_dom, _entity, index) => index + 1
    }];
    columns.forEach(column => {
        if (column.valueType === 'Attachment') {
            tableColumns.push({ ...column, width: 120 })
        }
        if (column.valueType !== 'SubTable' && column.valueType !== 'group') {
            tableColumns.push({ ...column })
        }
    })

    if (recordActions?.length) {
        tableColumns.push({
            title: '操作',
            fixed: 'right',
            width: 100,
            valueType: 'option',
            render: (_dom, record) => recordActions ? recordActions.filter(filterVisibled).map((action) => {
                const { actionKey, actionName, refresh } = action;
                const recordActionAvailableFlags = record.recordActionAvailableFlags as Record<string, boolean>
                if (recordActionAvailableFlags && recordActionAvailableFlags[actionKey] === false) {
                    return null;
                }
                const trigger = <a>{actionName || actionKey}</a>
                const actionInfo: ActionInfo = Object.assign({}, action, { trigger, data: record });
                return buildAction(actionInfo)
            }).filter(action => action != null) : []
        })
    } else if(!readonly) {
        tableColumns.push({
            title: '操作',
            fixed: 'right',
            width: 100,
            valueType: 'option'
        })
    }
    return tableColumns
}
interface EditableTableConfig {
    columnKeys: any[],
    columns: ProColumns[],
    editable: RowEditableConfig<Record<string, any>>,
    value: Record<string, any>[]
}

const buildTableConfig = (
    columns: ProColumns[],
    newValues?: Record<string, any>[],
    name?: string,
    parentName?: string | string[],
    recordActions?: ActionInfo[],
    editableFormRef?: React.RefObject<EditableFormInstance>,
    readonly?: boolean,
    onChange?: (
        value: readonly Record<string, any>[],
    ) => void,
    oldConfig?: EditableTableConfig,
): EditableTableConfig | undefined => {
    let columnKeys = oldConfig?.columnKeys || columns.map((column) => column.dataIndex)
    if (oldConfig && newValues?.length === oldConfig.value.length) {
        const diffItems = oldConfig.value.find((item, index) => {
            const newItem = newValues[index]
            return columnKeys.find((key) => {
                let itemColumnValue;
                if (Array.isArray(key)) {
                    itemColumnValue = getByPaths(item, key)
                } else {
                    itemColumnValue = item[key]
                }
                let newItemColumnValue;
                if (Array.isArray(key)) {
                    newItemColumnValue = getByPaths(newItem, key)
                } else {
                    newItemColumnValue = item[key]
                }
                return itemColumnValue != newItemColumnValue
            })
        })
        if (!diffItems) {
            return
        }
    }
    const editableKeys: string[] = []
    newValues?.forEach((item, index) => {
        const editableKey = index.toString()
        if (item[EDIT_ID] === undefined) {
            item[EDIT_ID] = editableKey
        }
        editableKeys.push(editableKey)
    });

    return {
        columnKeys,
        columns: buildTableColumns(columns, recordActions, readonly),
        editable: buildEditableConfig(editableKeys, name, parentName, recordActions, editableFormRef, readonly, onChange),
        value: newValues || []
    }

}

const SubTable: React.FC<{
    name?: string;
    parentName?: string | string[];
    title?: string;
    noAdd?: boolean;
    creatorButtonText?: boolean;
    readonly?: boolean;
    recordActions?: ActionInfo[];
    value?: Record<string, any>[];
    onChange?: (
        value: readonly Record<string, any>[],
    ) => void;
    columns: ProColumns[]
    editableFormRef?: React.RefObject<EditableFormInstance>
}> = ({ name, parentName, title, creatorButtonText, readonly, recordActions, value, onChange, columns, editableFormRef, noAdd }) => {
    const valueChange = useCallback((recordList: readonly Record<string, any>[]) => {
        onChange?.(recordList);
    }, []);

    const [tableConfig, setTableConfig] = useState<EditableTableConfig | undefined>(buildTableConfig(columns, value, name, parentName, recordActions, editableFormRef, readonly, valueChange));

    useEffect(() => {
        const newTableConfig = buildTableConfig(columns, value, name, parentName, recordActions, editableFormRef, readonly, valueChange, tableConfig)
        if (newTableConfig) {
            setTableConfig(newTableConfig)
        }
    }, [value, columns, recordActions])

    let recordCreatorProps: any | boolean = false
    if (readonly !== true && noAdd !== true) {
        recordCreatorProps = {
            newRecordType: 'dataSource',
            creatorButtonText: (creatorButtonText || '新增一行数据'),
            record: (index?: number) => {
                return {
                    [EDIT_ID]: index?.toString() || '0',
                }
            },
        }
    }

    return (
        <EditableProTable<Record<string, any>>
            cardBordered
            // controlleds
            editableFormRef={editableFormRef}
            creatorButtonText={creatorButtonText}
            name={name}
            parentName={parentName}
            headerTitle={title}
            rowKey={EDIT_ID}
            // onChange={valueChange}
            recordCreatorProps={recordCreatorProps}
            {...tableConfig}
        />
    );
};

export default SubTable;