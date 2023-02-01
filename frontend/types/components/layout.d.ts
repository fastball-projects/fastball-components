import { ReferencedComponent } from '../common'
import { BasicComponentProps, ReactComponent } from '../component'

export type LayoutProps = {
    layoutType: LayoutType
} & BasicComponentProps

export type LeftAndRightLayoutProps = {
    layoutType?: 'LeftAndRight'
    left: ReferencedComponent
    right: ReferencedComponent
} & BasicComponentProps

export type TopAndBottomLayoutProps = {
    layoutType?: 'TopAndBottom'
    top: ReferencedComponent
    bottom: ReferencedComponent
} & BasicComponentProps

export type LeftAndTopBottomLayoutProps = {
    layoutType?: 'LeftAndTopBottom'
    left: ReferencedComponent
    top: ReferencedComponent
    bottom: ReferencedComponent
} & BasicComponentProps

export type GridLayoutProps = {
    layoutType?: 'Grid'
    cols: number
    rowHeight: number
    draggable: boolean
    resizable: boolean
    cells: GridCell[]
} & BasicComponentProps

export type GridCell = {
    x: number
    y: number
    width: number
    height: number
    component: ReferencedComponent
}

export type LayoutType = 'LeftAndRight' | 'TopAndBottom' | 'LeftAndTopBottom' | 'Grid';