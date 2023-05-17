import { EditableFormInstance, EditableProTable, ProColumns, RowEditableConfig } from '@ant-design/pro-components'
import React from 'react';
import { useState } from 'react';

const EDIT_ID = '__edit_id'

const SubTable: React.FC<{
    name?: string;
    title?: string;
    readonly?: boolean;
    value?: Record<string, any>[];
    onChange?: (
        value: readonly Record<string, any>[],
    ) => void;
    columns: ProColumns[]
    editableFormRef?: React.RefObject<EditableFormInstance>
}> = ({ name, title, readonly, value, onChange, columns, editableFormRef }) => {
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
                const values: any[] = Object.values(editableFormRef?.current?.getFieldsValue())
                onChange?.(values);
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

    const tableColumns: ProColumns[] = [...columns, {
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
            headerTitle={title}
            columns={tableColumns}
            rowKey={EDIT_ID}
            value={value || []}
            onChange={onChange}
            recordCreatorProps={recordCreatorProps}
            editable={editable}
        />
    );
};

export default SubTable;