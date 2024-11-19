import { Data, FieldInfo } from '../types/common'


export const makeMockArray = (fields: FieldInfo[]) => {
    const recordArray: Data[] = [];
    for (let i = 0; i < 9; i++) {
        recordArray.push(makeMockData(fields));
    }
    return recordArray;
}

export const makeMockData = (fields: FieldInfo[]) => {
    const record: Data = {};
    fields.forEach(({ dataIndex, valueType }) => {
        if (valueType === 'Digit') {
            record[dataIndex] = 9527
        } else if (valueType === 'Text') {
            record[dataIndex] = 'Mock 文本'
        } else if (valueType === 'dateTime') {
            record[dataIndex] = Date.now()
        } else if (valueType === 'date') {
            record[dataIndex] = '2022-12-21'
        } else if (valueType === 'time') {
            record[dataIndex] = '18:12:21'
        }
    });
    return record;
}