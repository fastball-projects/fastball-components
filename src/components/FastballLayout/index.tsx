import * as React from 'react'
import { Divider, Row, Col } from 'antd';
import { ProCard } from '@ant-design/pro-components'
import { MD5 } from 'object-hash'
import { loadRefComponent } from '../../common'
import { LayoutProps, LeftAndRightLayoutProps, TopAndBottomLayoutProps, LeftAndTopBottomLayoutProps } from '../../../types'

const LeftAndRight: React.FC<LeftAndRightLayoutProps> = (props: LeftAndRightLayoutProps) => {
    const [record, setRecord] = React.useState(null)
    const left = loadRefComponent(props.left, { onRecordClick: setRecord })
    const right = loadRefComponent(props.right, { key: MD5(record), data: record })
    return (
        <ProCard
            split="vertical"
            bordered
            headerBordered
            style={{
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <ProCard
                style={{
                    height: '100vh',
                    overflow: 'auto',
                }}
            >{left}</ProCard>
            <ProCard
                style={{
                    height: '100vh',
                    overflow: 'auto',
                }}
            >{right}</ProCard>
        </ProCard>
    )
}

const TopAndBottom: React.FC<TopAndBottomLayoutProps> = (props: TopAndBottomLayoutProps) => {
    const [record, setRecord] = React.useState(null)
    const top = loadRefComponent(props.top, { onRecordClick: setRecord })
    const bottom = loadRefComponent(props.bottom, { key: MD5(record), data: record })
    return (
        <ProCard
            split="horizontal"
            bordered
            headerBordered
            style={{
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <ProCard>{top}</ProCard>
            <ProCard>{bottom}</ProCard>
        </ProCard>
    )
}


const LeftAndTopBottom: React.FC<LeftAndTopBottomLayoutProps> = (props: LeftAndTopBottomLayoutProps) => {
    const [leftRecord, setLeftRecord] = React.useState(null)
    const [topRecord, setTopRecord] = React.useState(null)
    const left = loadRefComponent(props.left, { onRecordClick: setLeftRecord })
    const top = loadRefComponent(props.top, { onRecordClick: setTopRecord, key: MD5(leftRecord), query: leftRecord })
    const bottom = loadRefComponent(props.bottom, { key: MD5(topRecord), data: topRecord })
    return (
        <ProCard
            split="vertical"
            bordered
            headerBordered
            style={{
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <ProCard
                style={{
                    height: '100vh',
                    overflow: 'auto',
                }}
            >{left}</ProCard>
            <ProCard
                split="horizontal"
                bordered
                headerBordered
                style={{
                    height: '100vh',
                    overflow: 'hidden',
                }}
            >
                <ProCard>{top}</ProCard>
                <ProCard>{bottom}</ProCard>
            </ProCard>
        </ProCard>
    )
}

const FastballLayout: React.FC<LayoutProps> = (props: LayoutProps) => {
    if (props.layoutType === 'LeftAndRight') {
        return <LeftAndRight {...props as LeftAndRightLayoutProps} />
    } else if (props.layoutType === 'TopAndBottom') {
        return <TopAndBottom {...props as TopAndBottomLayoutProps} />
    } else if (props.layoutType === 'LeftAndTopBottom') {
        return <LeftAndTopBottom {...props as LeftAndTopBottomLayoutProps} />
    } else {
        return null
    }
}

export default FastballLayout;
