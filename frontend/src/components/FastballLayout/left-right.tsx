import * as React from 'react'
import { ProCard } from '@fastball/pro-components'
import { Splitter } from 'antd'
import { MD5 } from 'object-hash'
import { loadRefComponent } from '../../common'
import { LeftAndRightLayoutProps } from '../../../types'
import "./index.css"

const LeftAndRight: React.FC<LeftAndRightLayoutProps> = (props: LeftAndRightLayoutProps) => {
    const [input, setInput] = React.useState(null)
    const rightKey = input ? MD5(input) : 'right'
    const left = loadRefComponent(props.left, { onRecordTriggered: setInput, onDataLoad: props.interlocking ? setInput : null, __designMode: props.__designMode, input: props.input })
    const right = loadRefComponent(props.right, { key: rightKey, __designMode: props.__designMode, input })
    return (
        <Splitter>
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