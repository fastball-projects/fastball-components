import * as React from 'react'
import { ProCard } from '@fastball/pro-components'
import { MD5 } from 'object-hash'
import { Splitter } from 'antd'
import { loadRefComponent } from '../../common'
import { TopAndBottomLayoutProps } from '../../../types'
import "./index.scss"

const TopAndBottom: React.FC<TopAndBottomLayoutProps> = (props: TopAndBottomLayoutProps) => {
    const [record, setRecord] = React.useState(null)
    const top = loadRefComponent(props.top, { onRecordClick: setRecord, onDataLoad: props.interlocking ? setRecord : null, __designMode: props.__designMode, input: props.input })
    const bottom = loadRefComponent(props.bottom, { key: MD5(record), input: record, __designMode: props.__designMode })
    return (
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
    )
}

export default TopAndBottom;