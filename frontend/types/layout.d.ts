import { ReferencedComponent } from './common'
import { LowcodeComponentProps, ReactComponent } from './component'

export type LayoutProps = {
    layoutType: LayoutType
} & LowcodeComponentProps

export type LeftAndRightLayoutProps = {
    layoutType?: 'LeftAndRight'
    left: ReferencedComponent | ReactComponent
    right: ReferencedComponent | ReactComponent
} & LowcodeComponentProps

export type TopAndBottomLayoutProps = {
    layoutType?: 'TopAndBottom'
    top: ReferencedComponent | ReactComponent
    bottom: ReferencedComponent | ReactComponent
} & LowcodeComponentProps

export type LeftAndTopBottomLayoutProps = {
    layoutType?: 'LeftAndTopBottom'
    left: ReferencedComponent | ReactComponent
    top: ReferencedComponent | ReactComponent
    bottom: ReferencedComponent | ReactComponent
} & LowcodeComponentProps

export type LayoutType = 'LeftAndRight' | 'TopAndBottom' | 'LeftAndTopBottom';