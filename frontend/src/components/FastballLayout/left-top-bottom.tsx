import * as React from 'react'
import { ProCard } from '@fastball/pro-components'
import { MD5 } from 'object-hash'
import { Splitter } from 'antd'
import { loadRefComponent } from '../../common'
import { LeftAndTopBottomLayoutProps } from '../../../types'
import "./index.scss"

const LeftAndTopBottom: React.FC<LeftAndTopBottomLayoutProps> = (props: LeftAndTopBottomLayoutProps) => {
    const [record, setRecord] = React.useState(null)
    const left = loadRefComponent(props.left, { onRecordClick: setRecord, onDataLoad: props.interlocking ? setRecord : null, __designMode: props.__designMode, input: props.input })
    const top = loadRefComponent(props.top, { __designMode: props.__designMode, key: MD5(record), input: record })
    const bottom = loadRefComponent(props.bottom, { key: MD5(record), __designMode: props.__designMode, input: record })
    return (

        <Splitter style={{ height: '100vh', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <Splitter.Panel defaultSize={props.leftWidth || "30%"}>
                <div className="layout-panel">
                    {left}
                </div>
            </Splitter.Panel>
            <Splitter.Panel>
                <Splitter layout="vertical" style={{ height: '100vh', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                    <Splitter.Panel defaultSize={"50%"}>
                        <div className="layout-panel">
                            {top}
                        </div>
                    </Splitter.Panel>
                    <Splitter.Panel>
                        <div className="layout-panel">
                            {bottom}
                        </div>
                    </Splitter.Panel>
                </Splitter>
            </Splitter.Panel>
        </Splitter>
    )
}

export default LeftAndTopBottom;