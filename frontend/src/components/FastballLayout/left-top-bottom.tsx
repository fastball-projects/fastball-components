import * as React from 'react'
import { ProCard } from '@ant-design/pro-components'
import { MD5 } from 'object-hash'
import { loadRefComponent } from '../../common'
import { LeftAndTopBottomLayoutProps } from '../../../types'

const LeftAndTopBottom: React.FC<LeftAndTopBottomLayoutProps> = (props: LeftAndTopBottomLayoutProps) => {
    const [record, setRecord] = React.useState(null)
    const left = loadRefComponent(props.left, { onRecordClick: setRecord, onDataLoad: props.interlocking ? setRecord : null, __designMode: props.__designMode, input: props.input })
    const top = loadRefComponent(props.top, { __designMode: props.__designMode, key: MD5(record), input: record })
    const bottom = loadRefComponent(props.bottom, { key: MD5(record), __designMode: props.__designMode, input: record })
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
            <ProCard colSpan="30%"
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
                }}
            >
                <ProCard>{top}</ProCard>
                <ProCard>{bottom}</ProCard>
            </ProCard>
        </ProCard>
    )
}

export default LeftAndTopBottom;