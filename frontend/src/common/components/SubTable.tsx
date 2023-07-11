import { EditableFormInstance, ProColumns, RowEditableConfig } from '@fastball/pro-components'
import { EditableProTable } from '@fastball/pro-components'
import React from 'react';
import { useState } from 'react';
import { ActionInfo } from '../../../types';
import { buildAction } from '../action';
import { filterVisibled } from '../field';
import { Button, Dropdown, MenuProps, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { getByPaths, setByPaths } from '../utils';

export const EDIT_ID = '__edit_id'

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
    // console.log('SubTable', name, value)
    // if (onChange && value?.find((item) => item[EDIT_ID] === undefined || item[EDIT_ID] === null)) {
    //     let nextEditId = 1;

    //     const editableData = value.map(item => {
    //         const newItem = { ...item }
    //         if (newItem[EDIT_ID] === undefined || newItem[EDIT_ID] === null) {
    //             newItem[EDIT_ID] = newItem.id || EDIT_ID + nextEditId++;
    //         }
    //         return newItem;
    //     })
    //     onChange?.(editableData)
    //     return <></>;
    // }

    value?.forEach((item, index) => item[EDIT_ID] = index.toString());

    let editable: RowEditableConfig<Record<string, any>> = {}
    let recordCreatorProps: any | boolean = false
    if (readonly !== true) {
        editable = {
            type: 'multiple',
            editableKeys: value?.map((record, i) => i.toString()),
            actionRender: (record, config, defaultDoms) => recordActions ? recordActions.filter(filterVisibled).map((action) => {
                const { actionKey, actionName, refresh } = action;
                const recordActionAvailableFlags = record.recordActionAvailableFlags as Record<string, boolean>
                if (recordActionAvailableFlags && recordActionAvailableFlags[actionKey] === false) {
                    return null;
                }
                const trigger = <a>{actionName || actionKey}</a>
                const actionInfo: ActionInfo = Object.assign({}, action, { trigger, data: record });
                return { key: actionKey, label: buildAction(actionInfo) }
            }).filter(action => action != null) : [
                <a
                    key="delete"
                    onClick={() => {
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
                    }}
                >
                    删除
                </a>,
            ],
            onValuesChange: (record, recordList) => {
                // const values: any[] = editableFormRef?.current?.getRowsData?.() || []
                // const newRecordList = recordList.map((formRecord, index) => Object.assign({}, values[index], formRecord))
                onChange?.(recordList);
            },
        }
        if (noAdd !== true) {
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
    }

    columns.filter(({ valueType }) => valueType === 'Attachment').forEach(column => column.width = 120)

    const tableColumns: ProColumns[] = [{
        title: '序号',
        dataIndex: '__row_index',
        readonly: true,
        width: 44,
        renderText: (_dom, _entity, index) => index + 1
    }, ...columns.filter(({ valueType }) => valueType !== 'SubTable' && valueType !== 'group'),]

    if (recordActions?.length) {
        tableColumns.push({
            title: '操作',
            fixed: 'right',
            width: 80,
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
    } else {
        //if (readonly)
        tableColumns.push({
            title: '操作',
            fixed: 'right',
            width: 100,
            valueType: 'option'
        })
    }

    return (
        <EditableProTable<Record<string, any>>
            cardBordered
            controlleds
            editableFormRef={editableFormRef}
            creatorButtonText={creatorButtonText}
            name={name}
            parentName={parentName}
            headerTitle={title}
            columns={tableColumns}
            rowKey={EDIT_ID}
            value={value}
            onChange={onChange}
            recordCreatorProps={recordCreatorProps}
            editable={editable}
        />
    );
};

export default SubTable;