import { ReferencedComponent } from '../common'
import { BasicComponentProps, ReactComponent } from '../component'

export type LayoutProps = {
    layoutType: LayoutType
    interlocking: boolean
} & BasicComponentProps

export type LeftAndRightLayoutProps = {
    layoutType?: 'LeftAndRight'
    left: ReferencedComponent
    leftWidth?: string
    right: ReferencedComponent
} & LayoutProps

export type TopAndBottomLayoutProps = {
    layoutType?: 'TopAndBottom'
    top: ReferencedComponent
    bottom: ReferencedComponent
} & LayoutProps

export type LeftAndTopBottomLayoutProps = {
    layoutType?: 'LeftAndTopBottom'
    left: ReferencedComponent
    top: ReferencedComponent
    bottom: ReferencedComponent
} & LayoutProps

export type GridLayoutProps = {
    layoutType?: 'Grid'
    cols: number
    rowHeight: number
    colMargin: number
    rowMargin: number
    draggable: boolean
    resizable: boolean
    cells: GridCell[]
} & LayoutProps

export type TabsLayoutProps = {
    items: TabItemProps[]
    defaultActiveTab: number
    keepAlive: boolean
} & LayoutProps

export type TabItemProps = {
    label: string
    component: ReferencedComponent
    input?: any
}

export type GridCell = {
    x: number
    y: number
    width: number
    height: number
    component: ReferencedComponent
}

export type StatisticsProps = {
    variableStatistics: boolean
    palette: string
    fields: StatisticsFieldInfo[]
} & BasicComponentProps

export type StatisticsFieldInfo = {
    name: string;
    title: string;
    precision: number;
    color: string;
    prefix: string;
    suffix: string;
}

export type LayoutType = 'LeftAndRight' | 'TopAndBottom' | 'LeftAndTopBottom' | 'Grid';