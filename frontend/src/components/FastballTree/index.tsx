import React, { FC, useEffect, useMemo, useState } from 'react';
import { Tree as AntDTree, Spin, Dropdown, Input, AutoComplete } from 'antd';
import type { TreeProps as AndDTreeProps, MenuProps, TreeDataNode } from 'antd';
import { MoreOutlined } from "@ant-design/icons";

import { buildAction, doApiAction, filterVisibled } from '../../common'
import type { ActionInfo, Data, ExpandedTreeData, SearchTreeData, TreeProps, TreeState } from '../../../types'

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

const getParentKey = (key: React.Key, tree: TreeDataNode[]): React.Key => {
    let parentKey: React.Key;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some((item) => item.key === key)) {
                parentKey = node.key;
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            }
        }
    }
    return parentKey!;
};

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

const FastballTree: FC<TreeProps> = (props: TreeProps) => {
    const [treeData, setTreeData] = useState<any[]>([]);
    const [searchOptions, setSearchOptions] = useState<any[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [loading, setLoading] = useState(true);

    const { componentKey, onRecordClick, __designMode, fieldNames, asyncTree, searchable, defaultExpandAll, recordActions, input } = props;


    const initLoadData = async () => {
        const res = await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', data: [null, input] })
        setTreeData(res.data || []);
        setLoading(false);
    }

    useEffect(() => {
        initLoadData()
    }, [input])

    if (loading) {
        return <Spin />
    }

    const treeProps: AndDTreeProps = { treeData, blockNode: true, defaultExpandAll }

    const asyncLoadData = async (parent?: Data) => {
        const res = await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', data: [parent, input] })
        const childrenNodes = res?.data || []
        let newTreeData: Data[] = childrenNodes;
        if (treeData && parent) {
            newTreeData = updateTreeData(treeData, parent, childrenNodes, fieldNames);
        }
        setTreeData(newTreeData);
        setLoading(false);
    }

    treeProps.treeData = treeData;

    if (searchable) {
        treeProps.selectable = true;
    }

    if (asyncTree) {
        treeProps.loadData = asyncLoadData;
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
                    // actionInfo.callback = () => reloadData()
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

    if (searchable) {
        const onSearch = async (text: string) => {
            const res = await doApiAction({ componentKey, type: 'API', actionKey: 'loadSearchData', data: [text, input] })
            const options = res?.data?.map((item: any) => ({
                value: item[fieldNames.searchDataTitle],
                record: item
            })) || []
            setSearchOptions(options)
        }

        const onExpand = (newExpandedKeys: React.Key[]) => {
            setExpandedKeys(newExpandedKeys);
            setAutoExpandParent(false);
          };

        const onSelect = async (value: string, item: { record: any }) => {
            const expandedTreeData: ExpandedTreeData = await doApiAction({ componentKey, type: 'API', actionKey: 'loadExpandedTreeData', data: [item.record, input] })
            setTreeData(expandedTreeData.data)
            setExpandedKeys(expandedTreeData.expandedKeys)
            setLoading(false);
            setAutoExpandParent(true);
        }
        treeProps.onExpand = onExpand;
        treeProps.expandedKeys = expandedKeys;
        treeProps.autoExpandParent = autoExpandParent;

        return <div>
            {searchable && <AutoComplete style={{ width: '100%' }} options={searchOptions} onSelect={onSelect} onSearch={onSearch} placeholder="快速查询" />}
            <AntDTree {...treeProps} />
        </div>
    }
    return <AntDTree {...treeProps} />
}


export default FastballTree;