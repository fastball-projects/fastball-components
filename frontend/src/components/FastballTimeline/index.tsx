import React from 'react';
import { Timeline as AntDTimeline, MenuProps, Spin } from 'antd';
import type { TimelineProps as AntDTimelineProps } from 'antd';
import { buildAction, doApiAction } from '../../common'
import { Data, TimelineProps } from '../../../types';

const mockData: Data[] = [
    {
        key: 1,
        color: 'green',
        time: '2015-09-01',
        title: 'Create a services site'
    }, {
        key: 2,
        color: 'red',
        time: '2016-01-01',
        title: 'Solve initial network problems 1'
    }, {
        key: 3,
        color: 'gray',
        time: '2016-12-31',
        title: 'Technical testing 1\nTechnical testing 2\nTechnical testing 3'
    }, {
        key: 4,
        color: '#00CCFF',
        time: '2017-01-01',
        title: 'Custom color testing'
    }
]

const defaultFieldNames: TimelineProps['fieldNames'] = {
    key: 'id',
    title: 'title',
    time: 'time',
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
        const { key, time, title, color } = timeLineFieldNames;

        return <AntDTimeline.Item
            color={color && record?.[color] as string || undefined}
            label={time ? record[time] as string : null}
        >{record[title] as string}</AntDTimeline.Item>
    })

    return (
        <AntDTimeline mode='left' {...treeProps}>
            {items}
        </AntDTimeline>
    )
};

export default Timeline;