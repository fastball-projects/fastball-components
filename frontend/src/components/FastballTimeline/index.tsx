import React from 'react';
import { Timeline as AntDTimeline, Spin } from 'antd';
import type { TimelineProps as AntDTimelineProps } from 'antd';
import { doApiAction } from '../../common'
import { Data, TimelineProps } from '../../../types';

const mockData: Data[] = [
    {
        key: 1,
        color: 'green',
        left: '2015-09-01',
        right: 'Create a services site'
    }, {
        key: 2,
        color: 'red',
        left: '2016-01-01',
        right: 'Solve initial network problems 1'
    }, {
        key: 3,
        color: 'gray',
        left: '2016-12-31',
        right: 'Technical testing 1\nTechnical testing 2\nTechnical testing 3'
    }, {
        key: 4,
        color: '#00CCFF',
        left: '2017-01-01',
        right: 'Custom color testing'
    }
]

const defaultFieldNames: TimelineProps['fieldNames'] = {
    key: 'id',
    right: 'right',
    left: 'left',
    color: 'color'
}

const Timeline: React.FC<TimelineProps> = ({ componentKey, onRecordClick, __designMode, fieldNames, recordActions, data, input }) => {
    const initData = __designMode === 'design' ? mockData : data
    const timeLineFieldNames = __designMode === 'design' ? defaultFieldNames : fieldNames
    const [timelineData, setTimelineData] = React.useState(initData);

    const loadData = async () => {
        const res = await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', data: [input] })
        setTimelineData(res || []);
    }

    if (timelineData == null) {
        loadData();
        return <Spin />
    }
    const treeProps: AntDTimelineProps = {}

    const items = timelineData.map((record: Data) => {
        const { key, left, right, color } = timeLineFieldNames;

        return <AntDTimeline.Item key={key}
            color={color && record?.[color] as string || undefined}
            label={left ? record[left] as string : null}
        >{record[right] as string}</AntDTimeline.Item>
    })

    return (
        <AntDTimeline mode='left' {...treeProps}>
            {items}
        </AntDTimeline>
    )
};

export default Timeline;