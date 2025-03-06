import * as React from 'react'
import { ProCard } from '@fastball/pro-components'
import { MD5 } from 'object-hash'
import { Splitter } from 'antd'
import { loadRefComponent } from '../../common'
import { LeftAndTopBottomLayoutProps } from '../../../types'
import "./index.scss"

const LeftAndTopBottom: React.FC<LeftAndTopBottomLayoutProps> = (props: LeftAndTopBottomLayoutProps) => {
    const [input, setInput] = React.useState(null)
    const left = loadRefComponent(props.left, { onRecordClick: setInput, onDataLoad: props.interlocking ? setInput : null, __designMode: props.__designMode, input: props.input })
    const top = loadRefComponent(props.top, { __designMode: props.__designMode, key: MD5(input), input })
    const bottom = loadRefComponent(props.bottom, { key: MD5(input), __designMode: props.__designMode, input })
    return (

        <Splitter>
            <Splitter.Panel defaultSize={props.leftWidth || "30%"}>
                <div className="layout-panel">
                    {left}
                </div>
            </Splitter.Panel>
            <Splitter.Panel>
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
            </Splitter.Panel>
        </Splitter>
    )
}

export default LeftAndTopBottom;