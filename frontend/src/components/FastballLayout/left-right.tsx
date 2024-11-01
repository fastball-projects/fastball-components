import * as React from 'react'
import { ProCard } from '@fastball/pro-components'
import { MD5 } from 'object-hash'
import { loadRefComponent } from '../../common'
import { LeftAndRightLayoutProps } from '../../../types'

const LeftAndRight: React.FC<LeftAndRightLayoutProps> = (props: LeftAndRightLayoutProps) => {
    const [record, setRecord] = React.useState(null)
    const left = loadRefComponent(props.left, { onRecordClick: setRecord, onDataLoad: props.interlocking ? setRecord : null, __designMode: props.__designMode, input: props.input })
    const right = loadRefComponent(props.right, { key: MD5(record), __designMode: props.__designMode, input: record })
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
            <ProCard colSpan={props.leftWidth || "30%"}
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

export default LeftAndRight;