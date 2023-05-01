import { EditableProTable, ProColumns, RowEditableConfig } from '@ant-design/pro-components'
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
}> = ({ name, title, readonly, value, onChange, columns }) => {
    console.log('SubTable', name, value)
    if (onChange && value?.find((item) => item[EDIT_ID] === undefined || item[EDIT_ID] === null)) {
        let nextEditId = 1;

        const editableData = value.map(item => {
            const newItem = { ...item }
            if (newItem[EDIT_ID] === undefined || newItem[EDIT_ID] === null) {
                newItem[EDIT_ID] = newItem.id || EDIT_ID + nextEditId++;
            }
            return newItem;
        })
        onChange?.(editableData)
        return <></>;
    }

    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => value?.map((item, index) => item[EDIT_ID]) || []);

    let editable: RowEditableConfig<Record<string, any>> = {}
    let recordCreatorProps: any | boolean = false
    if (readonly !== true) {
        editable = {
            type: 'multiple',
            editableKeys,
            actionRender: (row, config, defaultDoms) => {
                return [defaultDoms.save, defaultDoms.delete || defaultDoms.cancel];
            },
            onValuesChange: (record, recordList) => {
                console.log('sub table value change', record, recordList)
                onChange?.(recordList);
            },
            onChange: setEditableRowKeys,
        }
        recordCreatorProps = {
            newRecordType: 'dataSource',
            record: () => ({
                [EDIT_ID]: Date.now(),
            }),
        }
    }
    return (
        <EditableProTable<Record<string, any>>
            cardBordered
            name={name}
            headerTitle={title}
            columns={columns}
            rowKey={EDIT_ID}
            value={value}
            onChange={onChange}
            recordCreatorProps={recordCreatorProps}
            editable={editable}
        />
    );
};

export default SubTable;