import React, { useContext, useState } from "react";
import { LookupProps } from "../../../types";
import { SelectableTable } from "./LookupSelectableTable";
import { ProFormSelect } from "@fastball/pro-components";
import type { ProFormSelectProps } from "@fastball/pro-components";
import { Drawer } from "antd";
import { ContainerContext } from "../ContainerContext";

const LookupComponent: React.FC<LookupProps> = ({ componentKey, lookup, value, onChange, params, request,  ...otherProps }) => {
    const [open, setOpen] = useState(false);
    const [initialValue, setInitialValue] = useState();
    const closeDropdown = () => setOpen(false);
    const { multiple, valueField, labelField, selectedFirst } = lookup

    const containerContext = useContext(ContainerContext)
    const container = containerContext?.container
    const getContainer = container ? () => container : undefined;

    const selectProps: ProFormSelectProps = {
        ...otherProps,
        request,
        value,
        style: { width: '100%' },
        fieldProps: {
            open: false,
            // onDropdownVisibleChange: (visible) => setOpen(visible),
            showSearch: false,
            popupMatchSelectWidth: 1,
            getPopupContainer: getContainer,
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
    if(selectedFirst) {
        selectProps.request = async (params: any) => {
            const data = await request(params);
            if(data?.length) {
                setInitialValue(data[0][valueField]);
            }
            return data;
        }
        selectProps.key = initialValue
        selectProps.initialValue = initialValue
    }
    
    //     options: data
    return <>
        <Drawer width="75%" open={open} onClose={() => setOpen(false)} getContainer={getContainer}>
            <SelectableTable closeDropdown={closeDropdown} componentKey={componentKey} value={value} onChange={onChange}
                onSelect={otherProps.fieldProps?.onSelect} lookup={lookup} params={params} />
        </Drawer>
        <ProFormSelect {...selectProps} params={params} />
    </>;
};

export default LookupComponent;
