import React from 'react';
import { Tree as AntDTree, Spin, Dropdown } from 'antd';
import type { TreeProps as AndDTreeProps, MenuProps } from 'antd';
import { MoreOutlined } from "@ant-design/icons";

import { buildAction, doApiAction, filterVisibled } from '../../common'
import type { ActionInfo, ActionRef, Data, TreeProps, TreeState } from '../../../types'

const mockData: Data[] = [{
    key: "1",
    title: "Test Root",
    children: [{
        key: "1-1",
        title: "Test Node1",
        children: []
    }, {
        key: "1-2",
        title: "Test Node2",
        children: [{
            key: "1-2-1",
            title: "Test Sub Node1"
        }, {
            key: "1-2-2",
            title: "Test Sub Node2"
        }]
    }]
}]

const updateTreeData = (list: Data[], parent: Data, children: Data[], fieldNames: TreeProps['fieldNames']): Data[] =>
    list.map((node) => {
        if (node[fieldNames.key] === parent[fieldNames.key]) {
            const newNode = {
                ...node,
            };
            newNode[fieldNames.children] = children;
            return newNode;
        }
        if (node[fieldNames.children]) {
            const currentChildren = node[fieldNames.children] as Data[]

            const newNode = {
                ...node,
            };
            newNode[fieldNames.children] = updateTreeData(currentChildren, parent, children, fieldNames);
            return newNode;
        }
        return node;
    });

class Tree extends React.Component<TreeProps, TreeState> {

    constructor(props: TreeProps) {
        super(props)
        const treeData: Data[] | undefined = props.__designMode === 'design' ? mockData : props.data
        this.state = { treeData, loading: !treeData }
    }

    componentDidMount(): void {
        if (!this.state.treeData) {
            this.loadData()
        }
    }

    loadData = async (parent?: Data) => {
        let treeData: Data[];
        if (this.props.asyncTree) {
            treeData = await this.asyncLoadData(parent);
        } else {
            treeData = await this.loadAllData();
        }
        this.setState({ treeData, loading: false });
    }

    reloadData = async () => {

    }

    asyncLoadData = async (parent?: Data) => {
        const { componentKey, fieldNames, input } = this.props;
        const { treeData } = this.state
        const res = await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', data: [parent, input] })
        const childrenNodes = res?.data || []
        let newTreeData: Data[] = childrenNodes;
        if (treeData && parent) {
            newTreeData = updateTreeData(treeData, parent, childrenNodes, fieldNames);
        }
        return newTreeData
    }

    loadAllData = async () => {
        const { componentKey, input } = this.props;
        const res = await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', data: [input] })
        return res?.data || []
    }

    render(): React.ReactNode {
        const { treeData, loading } = this.state;
        if (loading) {
            return <Spin />
        }
        const { componentKey, onRecordClick, __designMode, fieldNames, asyncTree, defaultExpandAll, recordActions } = this.props;
        const treeProps: AndDTreeProps = { treeData, blockNode: true, defaultExpandAll }

        if (asyncTree) {
            treeProps.loadData = this.loadData;
        }

        if (__designMode !== 'design') {
            treeProps.fieldNames = fieldNames;
        }
        if (onRecordClick) {
            treeProps.onSelect = (_, { node }) => {
                onRecordClick(node)
            }
        }
        if (recordActions && recordActions.length > 0) {
            treeProps.titleRender = (node) => {
                const items: MenuProps["items"] = recordActions.filter(filterVisibled).map(action => {
                    const actionInfo: ActionInfo = { trigger: <div>{action.actionName || action.actionKey}</div>, componentKey, ...action, data: node };
                    if (action.refresh) {
                        actionInfo.callback = () => this.reloadData()
                    }
                    return ({
                        key: action.actionKey,
                        label: buildAction(actionInfo)
                    })
                })
                return (
                    <>
                        <span>{node[fieldNames.title]}</span>
                        <span style={{ float: 'right' }}>
                            <Dropdown menu={{ items }} trigger={["hover"]}>
                                <MoreOutlined />
                            </Dropdown>
                        </span>
                    </>
                )
            }
        }

        return <AntDTree {...treeProps} />;
    }
}
export default Tree;