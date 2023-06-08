import React, { useState } from 'react';
import { Cascader } from 'antd';
import options from '../../data/pcas.json'

const allOption = options as AddressOption[]

type AddressData = {
    provinceCode?: string
    cityCode?: string
    areaCode?: string
    streetCode?: string
    addressDetail?: string
}

type AddressOption = {
    name: string
    code: string
    children: AddressOption[]
}

const optionMap: Record<string, AddressOption> = {}

const putOption = (option: AddressOption) => {
    optionMap[option.code] = option
    option.children?.forEach(putOption)
}

allOption.forEach(putOption)

const fieldNames = { label: 'name', value: 'code', children: 'children' }

const format = (value?: Record<string, string>) => {
    if (!value) {
        return [];
    }
    const { provinceCode, cityCode, areaCode, streetCode } = value;
    return [provinceCode, cityCode, areaCode, streetCode];
}

const convert = (value?: string[]) => {
    if (!value) {
        return {};
    }
    const [provinceCode, cityCode, areaCode, streetCode] = value;
    return { provinceCode, cityCode, areaCode, streetCode };
}

const Address: React.FC<{
    readonly?: boolean,
    value?: Record<string, string>,
    onChange?: (value: Record<string, string>) => void
}> = ({ readonly, value, onChange }) => {
    const [data, setData] = useState<readonly string[]>(() => format(value));
    const onDataChange = (data: readonly string[]) => {
        setData(data);
        const [provinceCode, cityCode, areaCode, streetCode] = data;
        onChange?.({ provinceCode, cityCode, areaCode, streetCode })
    }
    if (readonly) {
        if (!data) {
            return null;
        }
        let text = ''
        for (let index = 0; index < data.length; index++) {
            const code = data[index];
            if (!code) {
                return text;
            }
            text += optionMap[code].name
        }
        return text;
    }
    return <Cascader options={options} fieldNames={fieldNames} expandTrigger="hover" onChange={onDataChange} />
}

export default Address;