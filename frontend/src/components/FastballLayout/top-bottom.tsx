import * as React from 'react'
import { ProCard } from '@fastball/pro-components'
import { MD5 } from 'object-hash'
import { loadRefComponent } from '../../common'
import { TopAndBottomLayoutProps } from '../../../types'

const TopAndBottom: React.FC<TopAndBottomLayoutProps> = (props: TopAndBottomLayoutProps) => {
    const [record, setRecord] = React.useState(null)
    const top = loadRefComponent(props.top, { onRecordClick: setRecord, onDataLoad: props.interlocking ? setRecord : null, __designMode: props.__designMode, input: props.input})
    const bottom = loadRefComponent(props.bottom, { key: MD5(record), input: record, __designMode: props.__designMode })
    return (
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
    )
}

export default TopAndBottom;