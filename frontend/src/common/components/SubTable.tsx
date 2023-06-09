import { EditableFormInstance, EditableProTable, ProColumns, RowEditableConfig } from '@ant-design/pro-components'
import React from 'react';
import { useState } from 'react';

export const EDIT_ID = '__edit_id'

const SubTable: React.FC<{
    name?: string;
    parentName?: string | string[];
    title?: string;
    readonly?: boolean;
    value?: Record<string, any>[];
    onChange?: (
        value: readonly Record<string, any>[],
    ) => void;
    columns: ProColumns[]
    editableFormRef?: React.RefObject<EditableFormInstance>
}> = ({ name, parentName, title, readonly, value, onChange, columns, editableFormRef }) => {
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
            actionRender: (row, config, defaultDoms) => {
                return [defaultDoms.delete || defaultDoms.cancel];
            },
            onValuesChange: (record, recordList) => {
                // const values: any[] = editableFormRef?.current?.getRowsData?.() || []
                // const newRecordList = recordList.map((formRecord, index) => Object.assign({}, values[index], formRecord))
                console.log(record, recordList)
                onChange?.(recordList);
            },
        }
        recordCreatorProps = {
            newRecordType: 'dataSource',
            record: (index?: number) => {
                return {
                    [EDIT_ID]: index?.toString() || '0',
                }
            },
        }
    }

    const tableColumns: ProColumns[] = [{
        title: '序号',
        dataIndex: '__row_index',
        readonly: true,
        renderText: (_dom, _entity, index) => index + 1
    }, ...columns.filter(({ valueType }) => valueType !== 'SubTable'), {
        title: '操作',
        valueType: 'option',
        render: () => null
    }]

    return (
        <EditableProTable<Record<string, any>>
            cardBordered
            controlleds
            editableFormRef={editableFormRef}
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