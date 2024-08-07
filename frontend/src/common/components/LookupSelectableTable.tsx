import React, { useContext } from "react";
import { ProColumnType, ProTable } from "@fastball/pro-components";
import { FastballFieldProvider, buildTableColumns } from "../field";
import { Data, LookupSelectableTableProps } from "../../../types";
import { ProColumnGroupType, ProTableProps } from "@ant-design/pro-table/es/typing";
import { doLookupAction } from "../action";
import { FastballContext } from "../../components/FastballContext";

export const SelectableTable: React.FC<LookupSelectableTableProps> = ({ componentKey, closeDropdown, lookup, value, params, onChange, onSelect }) => {
    const { columns, queryFields, valueField, showSearch, multiple } = lookup
    const proTableColumns: (ProColumnGroupType<Data, "text"> | ProColumnType<Data, "text">)[] = []

    const containerContext = useContext(FastballContext)
    const container = containerContext?.container

    const proTableProps: ProTableProps<Data, { keyWord?: string }> = {
        size: 'small',
        search: { labelWidth: "auto" },
        columns: proTableColumns,
        options: {
            search: showSearch,
        },
        params,
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
            onChange: (selectedRowKeys: any, selectedRows: Record<string, any>[]) => {
                if (!multiple) {
                    onSelect?.(selectedRowKeys[0], selectedRows[0])
                    onChange?.(selectedRowKeys[0]);
                    closeDropdown()
                } else {
                    onChange?.(selectedRowKeys);
                }
            }
        },
        rowKey: valueField,
    }
    buildTableColumns(container!, componentKey, proTableColumns, columns, undefined)
    proTableProps.search = false;
    // if (!queryFields) {
    //     proTableProps.search = false;
    // }

    proTableProps.request = async (requestParam, sortFields, filter) => {
        let request;
        // if (queryFields) {
        const { pageSize, current, keyword, ...searchFields } = requestParam
        const searchParam = { sortFields, pageSize, current, keywords: keyword };
        const search = Object.assign({}, params?.search, searchFields, filter);
        Object.assign(searchParam, { search });
        request = searchParam
        // }
        const data = await doLookupAction(lookup, request);
        return { success: true, data };
    }
    return <FastballFieldProvider>
        <ProTable {...proTableProps} />
    </FastballFieldProvider>
}