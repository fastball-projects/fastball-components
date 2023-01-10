import { ReferencedComponent } from '../common'
import { LowcodeComponentProps, ReactComponent } from '../component'

export type LayoutProps = {
    layoutType: LayoutType
} & LowcodeComponentProps

export type LeftAndRightLayoutProps = {
    layoutType?: 'LeftAndRight'
    left: ReferencedComponent | ReactComponent<any>
    right: ReferencedComponent | ReactComponent<any>
} & LowcodeComponentProps

export type TopAndBottomLayoutProps = {
    layoutType?: 'TopAndBottom'
    top: ReferencedComponent | ReactComponent<any>
    bottom: ReferencedComponent | ReactComponent<any>
} & LowcodeComponentProps

export type LeftAndTopBottomLayoutProps = {
    layoutType?: 'LeftAndTopBottom'
    left: ReferencedComponent | ReactComponent<any>
    top: ReferencedComponent | ReactComponent<any>
    bottom: ReferencedComponent | ReactComponent<any>
} & LowcodeComponentProps

export type LayoutType = 'LeftAndRight' | 'TopAndBottom' | 'LeftAndTopBottom';