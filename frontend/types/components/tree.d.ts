import { ApiActionInfo, ActionInfo, ReferencedComponent, Data } from '../common'
import { BasicComponentProps, MultiDataComponent } from '../component'

export type TreeProps = {
    fieldNames: {
        key: string
        title: string
        children: string
        searchDataKey: string
        searchDataTitle: string
    }
    asyncTree: boolean
    searchable: boolean
    defaultExpandAll: boolean
    data?: Data[]
    recordActions?: ApiActionInfo[]
} & BasicComponentProps & MultiDataComponent

export type TreeState = {
    treeData?: Data[]
    loading?: boolean
}

export type ExpandedTreeData = {
    data: Data[]
    expandedKeys: React.Key[]
    selectedRecord: Data
}