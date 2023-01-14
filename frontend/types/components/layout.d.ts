import { ReferencedComponent } from '../common'
import { BasicComponentProps, ReactComponent } from '../component'

export type LayoutProps = {
    layoutType: LayoutType
} & BasicComponentProps

export type LeftAndRightLayoutProps = {
    layoutType?: 'LeftAndRight'
    left: ReferencedComponent | ReactComponent<any>
    right: ReferencedComponent | ReactComponent<any>
} & BasicComponentProps

export type TopAndBottomLayoutProps = {
    layoutType?: 'TopAndBottom'
    top: ReferencedComponent | ReactComponent<any>
    bottom: ReferencedComponent | ReactComponent<any>
} & BasicComponentProps

export type LeftAndTopBottomLayoutProps = {
    layoutType?: 'LeftAndTopBottom'
    left: ReferencedComponent | ReactComponent<any>
    top: ReferencedComponent | ReactComponent<any>
    bottom: ReferencedComponent | ReactComponent<any>
} & BasicComponentProps

export type LayoutType = 'LeftAndRight' | 'TopAndBottom' | 'LeftAndTopBottom';