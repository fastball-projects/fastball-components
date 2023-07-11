import * as React from 'react'
import { LayoutProps, LeftAndRightLayoutProps, TopAndBottomLayoutProps, LeftAndTopBottomLayoutProps, GridLayoutProps } from '../../../types'
import LeftAndRight from './left-right'
import TopAndBottom from './top-bottom'
import LeftAndTopBottom from './left-top-bottom'
import GridLayout from './grid'
import { ContainerContextProvider } from '../../common/ContainerContext'

const FastballLayout: React.FC<LayoutProps> = (props: LayoutProps) => {
    let layoutComponent;
    if (props.layoutType === 'LeftAndRight') {
        layoutComponent = <LeftAndRight {...props as LeftAndRightLayoutProps} />
    } else if (props.layoutType === 'TopAndBottom') {
        layoutComponent = <TopAndBottom {...props as TopAndBottomLayoutProps} />
    } else if (props.layoutType === 'LeftAndTopBottom') {
        layoutComponent = <LeftAndTopBottom {...props as LeftAndTopBottomLayoutProps} />
    } else if (props.layoutType === 'Grid') {
        layoutComponent = <GridLayout {...props as GridLayoutProps} />
    } else {
        return null
    }
    return <ContainerContextProvider container={props.container}>{layoutComponent}</ContainerContextProvider>
}

export default FastballLayout;
