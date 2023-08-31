import React, { useState } from "react";
import { LookupProps } from "../../../types";
import { SelectableTable } from "./LookupSelectableTable";
import { ProFormSelect } from "@ant-design/pro-components";
import type { ProFormSelectProps } from "@ant-design/pro-components";
import { Drawer } from "antd";

const LookupComponent: React.FC<LookupProps> = ({ lookup, value, onChange, ...otherProps }) => {
    const [open, setOpen] = useState(false);
    const closeDropdown = () => setOpen(false);
    const { multiple, valueField, labelField } = lookup
    console.log('LookupComponent', lookup)
    const selectProps: ProFormSelectProps = {
        ...otherProps,
        value,
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
            <SelectableTable closeDropdown={closeDropdown} value={value} onChange={onChange} 
        onSelect={otherProps.fieldProps?.onSelect} lookup={lookup} />
        </Drawer>
        <ProFormSelect {...selectProps} />
    </>;
};

export default LookupComponent;
