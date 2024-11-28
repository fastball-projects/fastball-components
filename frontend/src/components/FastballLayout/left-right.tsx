import * as React from 'react'
import { ProCard } from '@fastball/pro-components'
import { Splitter } from 'antd'
import { MD5 } from 'object-hash'
import { loadRefComponent } from '../../common'
import { LeftAndRightLayoutProps } from '../../../types'
import "./index.scss"

const LeftAndRight: React.FC<LeftAndRightLayoutProps> = (props: LeftAndRightLayoutProps) => {
    const [record, setRecord] = React.useState(null)
    const left = loadRefComponent(props.left, { onRecordClick: setRecord, onDataLoad: props.interlocking ? setRecord : null, __designMode: props.__designMode, input: props.input })
    const right = loadRefComponent(props.right, { key: MD5(record), __designMode: props.__designMode, input: record })
    return (
        <Splitter style={{ height: '100vh', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <Splitter.Panel defaultSize={props.leftWidth || "30%"}>
                <div className="layout-panel">
                    {left}
                </div>
            </Splitter.Panel>
            <Splitter.Panel>
                <div className="layout-panel">
                    {right}
                </div>
            </Splitter.Panel>
        </Splitter >
    )
}

export default LeftAndRight;