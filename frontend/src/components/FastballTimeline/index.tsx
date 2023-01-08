import React from 'react';
import { Timeline as AntDTimeline, MenuProps, Spin } from 'antd';
import type { TimelineProps as AntDTimelineProps } from 'antd';
import { buildAction, doApiAction } from '../../common'
import { Data, TimelineProps } from '../../../types';

const mockData: Data[] = [
    {
        id: 1,
        color: 'green',
        label: '2015-09-01',
        content: 'Create a services site'
    }, {
        id: 2,
        color: 'red',
        label: '2016-01-01',
        content: 'Solve initial network problems 1'
    }, {
        id: 3,
        color: 'gray',
        label: '2016-12-31',
        content: 'Technical testing 1\nTechnical testing 2\nTechnical testing 3'
    }, {
        id: 4,
        color: '#00CCFF',
        label: '2017-01-01',
        content: 'Custom color testing'
    }
]

const defaultFieldNames: TimelineProps['fieldNames'] = {
    key: 'id',
    content: 'content',
    title: 'label',
    color: 'color'
}

const Timeline: React.FC<TimelineProps> = ({ componentKey, onRecordClick, __designMode, fieldNames, recordActions, data, input }) => {
    const initData = __designMode === 'design' ? mockData : data
    const timeLineFieldNames = __designMode === 'design' ? defaultFieldNames : fieldNames
    const [timelineData, setTimelineData] = React.useState(initData);

    const loadData = async () => {
        const res = await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', data: input })
        setTimelineData(res?.data || []);
    }

    if (timelineData == null) {
        loadData();
        return <Spin />
    }
    const treeProps: AntDTimelineProps = {}
    if (onRecordClick) {
        treeProps.onSelect = (_, { node }) => {
            onRecordClick(node)
        }
    }
    if (recordActions) {
        treeProps.titleRender = (node) => {
            const items: MenuProps["items"] = recordActions.filter(({ display }) => display !== false).map(action => ({
                key: action.actionKey,
                label: buildAction({ trigger: action.actionName || action.actionKey, componentKey, ...action, data: node })
            }))
            return (
                <>
                    <span>{node[fieldNames.title]}</span>
                    <span style={{ float: 'right' }}>
                        <Dropdown menu={{ items }} trigger={["hover"]}>
                            <MoreOutlined />
                        </Dropdown>
                    </span>
                </>
            )
        }
    }

    

    const renderItem = (record: Data) => {
        const { key, time, text, color } = timeLineFieldNames;

        return <AntDTimeline.Item
            color={color && record?.[color] as string || undefined}
            label={time ? record[time] as string : null}
        >{record[text] as string}</AntDTimeline.Item>
    }

    return (
        <AntDTimeline>

        </AntDTimeline>
    )
};

export default Timeline;