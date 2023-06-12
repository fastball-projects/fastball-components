import React from "react";
import type { AutoCompleteProps } from 'antd';
import { AutoComplete as AntDAutoComplete, InputNumber, Input, Col, Row } from 'antd';
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { useEffect } from "react";
import { doAutoCompleteAction } from "../action";

type AutoCompleteType = {
    autoCompleteKey: string;
    readonly?: boolean;
    input?: any;
    value?: string | number;
    dependencyFields?: string[]
    inputType: 'Number' | 'Text';
    valueField: string;
    fields: { name: string, title: string }[];
    onChange?: (
        value: string | number | null,
    ) => void;
}

const renderTitle = (fields: { name: string, title: string }[]) => (
    <Row gutter={[8, 8]}>
        {fields.map(({ title }) => <Col flex={1} style={{ width: "160px" }}>{title}</Col>)}
    </Row>
);

const renderItem = (valueField: string, fields: { name: string, title: string }[], record: Record<string, any>) => ({
    value: record[valueField],
    label: <Row gutter={[8, 8]}>
        {fields.map(({ name }) => <Col flex={1} style={{ width: "160px" }}>{record[name]}</Col>)}
    </Row>
});

const CustomInputNumber = ({ onChange, ...rest }) => {
    const handleChange = value => {
        onChange({
            target: {
                value: value,
            },
        });
    };

    return <InputNumber onChange={handleChange} {...rest} />;
}

const AutoComplete: React.FC<AutoCompleteType> = ({ autoCompleteKey, input, dependencyFields, value, inputType, readonly, valueField, fields, onChange }: AutoCompleteType) => {
    let inputComponent;
    if (inputType == 'Number') {
        inputComponent = <CustomInputNumber value={value} readOnly={readonly} />
    } else {
        inputComponent = <Input value={value} readOnly={readonly} />
    }
    if (readonly) {
        return inputComponent;
    }

    const [options, setOptions] = useState<AutoCompleteProps['options']>();

    const loadOptions = async () => {
        const result = await doAutoCompleteAction(autoCompleteKey, [input]);
        const option = {
            label: renderTitle(fields),
            options: result.map((item: Record<string, any>) => renderItem(valueField, fields, item))
        }
        setOptions([option]);
    }
    if (Array.isArray(dependencyFields) && dependencyFields.length > 0) {
        const dependencyValues: Record<string, any> = {}
        if (input) {
            dependencyFields.forEach(field => dependencyValues[field] = input[field])
        }
        const dependencyList = [dependencyFields, dependencyValues]
        useEffect(() => {
            loadOptions()
        }, dependencyList)
    }

    return <AntDAutoComplete
        popupMatchSelectWidth={false}
        onChange={onChange}
        options={options}
    >
        {inputComponent}
    </AntDAutoComplete>;
}

export default AutoComplete;