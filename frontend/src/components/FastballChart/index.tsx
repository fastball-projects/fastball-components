import React, { useState, useEffect } from 'react';
import { Line, LineConfig, Column, ColumnConfig, Pie, PieConfig, Bar, BarConfig, Area, AreaConfig, } from '@ant-design/plots';
import { ChartProps, Data } from '../../../types';
import { doApiAction } from '../../common';

const mockData: Data[] = [
    { "year": "2009", "value": 3200, "category": "Liquid fuel" },
    { "year": "2010", "value": 4106, "category": "Solid fuel" },
    { "year": "2011", "value": 1783, "category": "Gas fuel" },
    { "year": "2012", "value": 519, "category": "Cement production" },
    { "year": "2013", "value": 65, "category": "Gas flarinl" },
    { "year": "2014", "value": 3220, "category": "Liquid fuel" },
    { "year": "2015", "value": 4126, "category": "Solid fuel" },
    { "year": "2016", "value": 1806, "category": "Gas fuel" },
    { "year": "2017", "value": 554, "category": "Cement production" },
    { "year": "2018", "value": 68, "category": "Gas flarinl" },
    { "year": "2019", "value": 3280, "category": "Liquid fuel" },
    { "year": "2020", "value": 4117, "category": "Solid fuel" },
    { "year": "2021", "value": 1823, "category": "Gas fuel" },
    { "year": "2022", "value": 568, "category": "Cement production" },
    { "year": "2023", "value": 68, "category": "Gas flarinl" }
]

const mockFieldNames: ChartProps['fieldNames'] = {
    xField: 'year',
    yField: 'value',
    seriesField: 'category'
}

const FastballChart: React.FC<ChartProps> = ({ componentKey, type, fieldNames, input, onDataLoad, __designMode }) => {
    const initData = __designMode === 'design' ? mockData : []
    const chartFieldNames = __designMode === 'design' ? mockFieldNames : fieldNames
    const { xField, yField, seriesField } = chartFieldNames
    const [data, setData] = useState(initData);

    const loadData = async () => {
        const res = await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', data: [input] })
        if (onDataLoad) {
            onDataLoad(res);
        }
        setData(res || []);
    }

    useEffect(() => {
        loadData();
    }, [input]);

    const config = { data, xField, yField, seriesField };
    if (type === 'Line') {
        return <Line {...config} />;
    } else if (type === 'Column') {
        return <Column {...config} />;
    } else if (type === 'Area') {
        return <Area {...config} />;
    } else if (type === 'Bar') {
        return <Bar {...config} />;
    } else {
        return <span>Chart type {type} not supported</span>
    }
};

export default FastballChart;
