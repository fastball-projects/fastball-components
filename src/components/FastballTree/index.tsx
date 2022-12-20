import React, { useState } from 'react';
import { Tree, Spin } from 'antd';
import type { TreeProps } from 'antd';

import { doApiAction } from '../../common'

const mockData = [{
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

const App: React.FC = ({ componentKey, onRecordClick, __designMode, data }) => {
    const initData = __designMode === 'design' ? mockData : data
    const [treeData, setTreeData] = useState(initData);

    const loadData = async () => {
        const treeData = await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', data })
        setTreeData(treeData?.data || []);
    }

    if (treeData == null) {
        loadData();
        return <Spin />
    }
    const treeProps: TreeProps = { treeData }
    if (onRecordClick) {
        treeProps.onSelect = (_, { node }) => {
            onRecordClick(node)
        }
    }

    return <Tree {...treeProps} />;
};

export default App;