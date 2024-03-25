import React, { useState } from "react";
import { ProFormTreeSelect } from "@fastball/pro-components";
import { TreeLookupProps } from "../../../types";
import { SelectableTable } from "./LookupSelectableTable";

const TreeLookupComponent: React.FC<TreeLookupProps> = ({ componentKey, lookup, value, onChange, ...otherProps }) => {
    const [open, setOpen] = useState(false);
    const closeDropdown = () => setOpen(false);
    const { multiple, valueField, labelField, childrenField } = lookup
    const selectProps = {
        ...otherProps,
        value,
        open,
        showSearch: false,
        popupMatchSelectWidth: false,
        fieldNames: {
            label: labelField,
            value: valueField,
            children: childrenField
        },
        dropdownRender: () => <SelectableTable closeDropdown={closeDropdown} componentKey={componentKey} value={value} onChange={onChange} lookup={lookup} />,
        multiple
    }
    //    treeData={data}
    return <ProFormTreeSelect {...selectProps} />;
};

export default TreeLookupComponent;
