import React, { useState } from 'react';
import { Tree as AntDTree, Spin, Dropdown } from 'antd';
import type { TreeProps as AndDTreeProps, MenuProps } from 'antd';
import { MoreOutlined } from "@ant-design/icons";

import { buildAction, doApiAction, filterVisibled } from '../../common'
import type { ActionInfo, TreeProps } from '../../../types'

const mockData = [{
    id: "1",
    title: "Test Root",
    children: [{
        id: "1-1",
        title: "Test Node1",
        children: []
    }, {
        id: "1-2",
        title: "Test Node2",
        children: [{
            id: "1-2-1",
            title: "Test Sub Node1"
        }, {
            id: "1-2-2",
            title: "Test Sub Node2"
        }]
    }]
}]

const Tree: React.FC<TreeProps> = ({ componentKey, onRecordClick, __designMode, fieldNames, defaultExpandAll, recordActions, data, input }) => {
    const initData = __designMode === 'design' ? mockData : data
    const [treeData, setTreeData] = useState(initData);

    const loadData = async () => {
        const treeData = await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', data: [input] })
        setTreeData(treeData?.data || []);
    }

    if (!treeData) {
        loadData();
        return <Spin />
    }
    const treeProps: AndDTreeProps = { treeData, blockNode: true, defaultExpandAll }
    if (__designMode !== 'design') {
        treeProps.fieldNames = fieldNames;
    }
    if (onRecordClick) {
        treeProps.onSelect = (_, { node }) => {
            onRecordClick(node)
        }
    }
    if (recordActions) {
        treeProps.titleRender = (node) => {
            const items: MenuProps["items"] = recordActions.filter(filterVisibled).map(action => {
                const actionInfo: ActionInfo = { trigger: action.actionName || action.actionKey, componentKey, ...action, data: node };
                if (action.refresh) {
                    actionInfo.callback = () => loadData()
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
};

export default Tree;