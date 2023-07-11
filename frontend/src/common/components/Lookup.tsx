import React, { useState } from "react";
import { LookupProps } from "../../../types";
import { SelectableTable } from "./LookupSelectableTable";
import { ProFormSelect } from "@ant-design/pro-components";
import type { ProFormSelectProps } from "@ant-design/pro-components";

const LookupComponent: React.FC<LookupProps> = ({ lookup, value, onChange, ...otherProps }) => {
    const [open, setOpen] = useState(false);
    const closeDropdown = () => setOpen(false);
    const { multiple, valueField, labelField } = lookup
    console.log('LookupComponent', lookup)
    const selectProps: ProFormSelectProps = {
        ...otherProps,
        value,
        fieldProps: {
            open,
            onDropdownVisibleChange: (visible) => setOpen(visible),
            showSearch: false,
            popupMatchSelectWidth: 600,
            fieldNames: {
                label: labelField,
                value: valueField
            },
            dropdownRender: () => <SelectableTable closeDropdown={closeDropdown} value={value} onChange={onChange} lookup={lookup} />,
            mode: multiple ? 'multiple' : undefined
        }
    }
    //     options: data
    return <ProFormSelect {...selectProps} />;
};

export default LookupComponent;
