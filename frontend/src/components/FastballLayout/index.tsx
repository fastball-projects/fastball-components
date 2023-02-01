import * as React from 'react'
import { LayoutProps, LeftAndRightLayoutProps, TopAndBottomLayoutProps, LeftAndTopBottomLayoutProps, GridLayoutProps } from '../../../types'
import LeftAndRight from './left-right'
import TopAndBottom from './top-bottom'
import LeftAndTopBottom from './left-top-bottom'
import GridLayout from './grid'

const FastballLayout: React.FC<LayoutProps> = (props: LayoutProps) => {
    if (props.layoutType === 'LeftAndRight') {
        return <LeftAndRight {...props as LeftAndRightLayoutProps} />
    } else if (props.layoutType === 'TopAndBottom') {
        return <TopAndBottom {...props as TopAndBottomLayoutProps} />
    } else if (props.layoutType === 'LeftAndTopBottom') {
        return <LeftAndTopBottom {...props as LeftAndTopBottomLayoutProps} />
    } else if (props.layoutType === 'Grid') {
        return <GridLayout {...props as GridLayoutProps} />
    } else {
        return null
    }
}

export default FastballLayout;
