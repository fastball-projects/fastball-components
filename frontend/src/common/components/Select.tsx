import React, { useState } from "react";
import { LookupProps } from "../../../types";
import { ProFormSelect } from "@fastball/pro-components";
import type { ProFormSelectProps } from "@fastball/pro-components";

const SelectComponent: React.FC<LookupProps> = ({ lookup, request, ...otherProps }) => {
    const [initialValue, setInitialValue] = useState();
    const { valueField, selectedFirst } = lookup
    const selectProps: ProFormSelectProps = {
        ...otherProps,
        request,
    }
    if(selectedFirst) {
        selectProps.request = async (params: any) => {
            const data = await request(params);
            if (data?.length) {
                setInitialValue(data[0][valueField]);
            }
            return data;
        }
        selectProps.key = initialValue
        selectProps.initialValue = initialValue
    }

    return <ProFormSelect {...selectProps} />
};

export default SelectComponent;
