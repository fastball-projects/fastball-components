import * as React from 'react'
import { ProCard } from '@fastball/pro-components'
import { MD5 } from 'object-hash'
import { Splitter } from 'antd'
import { loadRefComponent } from '../../common'
import { TopAndBottomLayoutProps } from '../../../types'
import "./index.css"

const TopAndBottom: React.FC<TopAndBottomLayoutProps> = (props: TopAndBottomLayoutProps) => {
    const [input, setInput] = React.useState(null)
    const top = loadRefComponent(props.top, { onRecordClick: setInput, onDataLoad: props.interlocking ? setInput : null, __designMode: props.__designMode, input: props.input })
    const bottom = loadRefComponent(props.bottom, { key: MD5(input), input, __designMode: props.__designMode })
    return (
        <Splitter layout="vertical">
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