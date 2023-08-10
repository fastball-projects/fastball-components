import React from "react";
import { ProColumnType, ProTable } from "@ant-design/pro-components";
import { FastballFieldProvider, buildTableColumns } from "../field";
import { Data, LookupSelectableTableProps } from "../../../types";
import { ProColumnGroupType, ProTableProps } from "@ant-design/pro-table/es/typing";
import { doLookupAction } from "../action";

export const SelectableTable: React.FC<LookupSelectableTableProps> = ({ closeDropdown, lookup, multiple, value, onChange }) => {
    const { columns, queryFields, valueField, showSearch } = lookup
    const proTableColumns: (ProColumnGroupType<Data, "text"> | ProColumnType<Data, "text">)[] = []
    const proTableProps: ProTableProps<Data, { keyWord?: string }> = {
        size: 'small',
        search: { labelWidth: "auto" },
        columns: proTableColumns,
        options: {
            search: showSearch,
        },
        onRow: (record) => {
            return {
                onClick: () => {
                    // const recordValue = record[valueField]
                    // if (multiple === true) {
                    //     const selectedValueSet = new Set(value);
                    //     if (selectedValueSet.has(recordValue)) {
                    //         selectedValueSet.delete(recordValue);
                    //     } else {
                    //         selectedValueSet.add(recordValue);
                    //     }
                    //     onChange?.(selectedValueSet.values());
                    // } else {
                    //     onChange?.(recordValue)
                    //     closeDropdown()
                    // }
                }
            };
        },
        rowSelection: {
            type: multiple === true ? "checkbox" : "radio",
            selectedRowKeys: value ? multiple === true ? value : [value] : [],
            onChange: (selectedRowKeys: any) => {
                console.log(selectedRowKeys)
                if (!multiple) {
                    onChange?.(selectedRowKeys[0]);
                    closeDropdown()
                } else {
                    onChange?.(selectedRowKeys);
                }
            }
        },
        rowKey: valueField,
    }
    buildTableColumns(proTableColumns, columns, undefined)
    proTableProps.search = false;
    // if (!queryFields) {
    //     proTableProps.search = false;
    // }

    proTableProps.request = async (params, sortFields, filter) => {
        let request;
        if (queryFields) {
            const { pageSize, current, keyword, ...searchFields } = params
            const searchParam = { sortFields, pageSize, current, keywords: keyword };
            const search = Object.assign({}, searchFields, filter);
            Object.assign(searchParam, { search });
            request = searchParam
        }
        const data = await doLookupAction(lookup, request);
        return { success: true, data };
    }
    console.log(proTableProps)
    return <FastballFieldProvider>
        <ProTable {...proTableProps} />
    </FastballFieldProvider>
}