import React, { useState } from 'react';
import { Cascader } from 'antd';
import data from '../../data/pcas.json'

const options = data

const fieldNames = { label: 'name', value: 'code', children: 'children' }

const format = (value?: Record<string, string>) => {
    if (!value) {
        return [];
    }
    const { provinceCode, cityCode, areaCode, streetCode } = value;
    return [provinceCode, cityCode, areaCode, streetCode];
}

const Address: React.FC<{
    value?: Record<string, string>,
    onChange?: (value: Record<string, string>) => void
}> = ({ value, onChange }) => {
    const [data, setData] = useState<readonly string[]>(() => format(value));
    const onDataChange = (data: readonly string[]) => {
        setData(data);
        const [provinceCode, cityCode, areaCode, streetCode] = data;
        onChange?.({ provinceCode, cityCode, areaCode, streetCode })
    }
    return <Cascader options={options} fieldNames={fieldNames} expandTrigger="hover" onChange={onDataChange} />
}

export default Address;