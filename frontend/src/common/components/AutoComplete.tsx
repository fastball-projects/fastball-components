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
    value?: string | number;
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

const AutoComplete: React.FC<AutoCompleteType> = ({ autoCompleteKey, value, inputType, readonly, valueField, fields, onChange }: AutoCompleteType) => {
    let input;
    if (inputType == 'Number') {
        input = <CustomInputNumber value={value} readOnly={readonly} />
    } else {
        input = <Input value={value} readOnly={readonly} />
    }
    if (readonly) {
        return input;
    }

    const [options, setOptions] = useState<AutoCompleteProps['options']>();

    const loadOptions = async () => {
        const result = await doAutoCompleteAction(autoCompleteKey, value);
        const option = {
            label: renderTitle(fields),
            options: result.map((item: Record<string, any>) => renderItem(valueField, fields, item))
        }
        setOptions([option]);
    }

    useEffect(() => {
        loadOptions()
    }, [])

    return <AntDAutoComplete
        popupMatchSelectWidth={false}
        onChange={onChange}
        options={options}
    >
        {input}
    </AntDAutoComplete>;
}

export default AutoComplete;