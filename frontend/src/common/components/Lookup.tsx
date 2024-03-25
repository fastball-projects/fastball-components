import React, { useState } from "react";
import { LookupProps } from "../../../types";
import { SelectableTable } from "./LookupSelectableTable";
import { ProFormSelect } from "@fastball/pro-components";
import type { ProFormSelectProps } from "@fastball/pro-components";
import { Drawer } from "antd";

const LookupComponent: React.FC<LookupProps> = ({ componentKey, lookup, value, onChange, params, ...otherProps }) => {
    const [open, setOpen] = useState(false);
    const closeDropdown = () => setOpen(false);
    const { multiple, valueField, labelField } = lookup
    const selectProps: ProFormSelectProps = {
        ...otherProps,
        value,
        style: { width: '100%' },
        fieldProps: {
            open: false,
            // onDropdownVisibleChange: (visible) => setOpen(visible),
            showSearch: false,
            popupMatchSelectWidth: 1,
            fieldNames: {
                label: labelField,
                value: valueField
            },
            onClick: (e) => {
                setOpen(true)
                e.preventDefault();
                e.stopPropagation();
            },
            mode: multiple ? 'multiple' : undefined
        }
    }
    //     options: data
    return <>
        <Drawer width="75%" open={open} onClose={() => setOpen(false)}>
            <SelectableTable closeDropdown={closeDropdown} componentKey={componentKey} value={value} onChange={onChange}
                onSelect={otherProps.fieldProps?.onSelect} lookup={lookup} params={params} />
        </Drawer>
        <ProFormSelect {...selectProps} params={params} />
    </>;
};

export default LookupComponent;
