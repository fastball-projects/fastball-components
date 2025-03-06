import React, { FC, useEffect, useState } from "react";
import { Tree as AntDTree, Spin, Dropdown, AutoComplete } from "antd";
import type { TreeProps as AndDTreeProps, MenuProps, TreeDataNode } from "antd";
import { MoreOutlined } from "@ant-design/icons";

import { buildAction, doApiAction, filterVisibled } from "../../common";
import type {
  ActionInfo,
  Data,
  ExpandedTreeData,
  TreeData,
  TreeProps,
} from "../../../types";

const mockData: Data[] = [
  {
    key: "1",
    title: "Test Root",
    children: [
      {
        key: "1-1",
        title: "Test Node1",
        children: [],
      },
      {
        key: "1-2",
        title: "Test Node2",
        children: [
          {
            key: "1-2-1",
            title: "Test Sub Node1",
          },
          {
            key: "1-2-2",
            title: "Test Sub Node2",
          },
        ],
      },
    ],
  },
];

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

const updateTreeData = (
  list: TreeData[],
  parent: TreeData,
  children: TreeData[],
  fieldNames: TreeProps["fieldNames"]
): TreeData[] =>
  list.map((node) => {
    if (node.key === parent.key) {
      const newNode = {
        ...node,
      };
      newNode.children = children;
      return newNode;
    }
    if (node.children) {
      const currentChildren = node.children;

      const newNode = {
        ...node,
      };
      newNode.children = updateTreeData(
        currentChildren,
        parent,
        children,
        fieldNames
      );
      return newNode;
    }
    return node;
  });

const buildTreeNode = (item: Data, fieldNames: TreeProps["fieldNames"]) => {
  if(item.___FB_IS_TREE_NODE___) {
    return item;
  }
  const treeNodeData: TreeData = {
    key: item[fieldNames.key],
    title: item[fieldNames.title],
    hasChildren: item[fieldNames.hasChildren],
    children: item[fieldNames.children]?.length && item[fieldNames.children].map(child => buildTreeNode(child, fieldNames)),
    data: item,
    ___FB_IS_TREE_NODE___: true
  }
  return treeNodeData;
}
const FastballTree: FC<TreeProps> = (props: TreeProps) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const [searchOptions, setSearchOptions] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [loading, setLoading] = useState(true);

  const buildAndSetTreeData = (data?: Data[]) => {
    const nodes: TreeData[] = data?.map(item => buildTreeNode(item, fieldNames)) || [];
    setTreeData(nodes)
  };

  const {
    componentKey,
    onRecordTriggered: onRecordClick,
    __designMode,
    fieldNames,
    asyncTree,
    searchable,
    defaultExpandAll,
    recordActions,
    input,
  } = props;

  const initLoadData = async () => {
    const res = await doApiAction({
      componentKey,
      type: "API",
      actionKey: "loadData",
      data: [null, input],
    });
    buildAndSetTreeData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    initLoadData();
  }, [input]);

  if (loading) {
    return <Spin />;
  }

  const treeProps: AndDTreeProps<TreeDataNode> = {
    treeData,
    blockNode: true,
    defaultExpandAll,
  };

  const asyncLoadData = async (parent?: Data) => {
    const res = await doApiAction({
      componentKey,
      type: "API",
      actionKey: "loadData",
      data: [parent.data, input],
    });
    const childrenNodes = res?.data?.map(item => buildTreeNode(item, fieldNames)) || [];
    childrenNodes.forEach((node: any) => {
      if (node.hasChildren === false) {
        node.isLeaf = true;
      }
    });
    let newTreeData: TreeData[] = childrenNodes;
    if (treeData && parent) {
      newTreeData = updateTreeData(treeData, parent, childrenNodes, fieldNames);
    }
    setTreeData(newTreeData);
    if (parent) {
      if (!expandedKeys.filter((k) => k === parent.key).length) {
        setExpandedKeys([...expandedKeys, parent.key]);
      }
    }
    setLoading(false);
  };

  treeProps.selectable = true;
  treeProps.treeData = treeData;
  treeProps.selectedKeys = selectedKeys;
  treeProps.onSelect = (_, { node, selectedNodes }) => {
    onRecordClick?.(node.data);
    setSelectedKeys(
      selectedNodes.map((item) => item.key).filter(Boolean)
    );
  };

  if (asyncTree) {
    treeProps.loadData = asyncLoadData;
  }

  // if (__designMode !== "design") {
  //   treeProps.fieldNames = fieldNames;
  // }

  if (recordActions && recordActions.length > 0) {
    treeProps.titleRender = (node) => {
      const items: MenuProps["items"] = recordActions
        .filter(filterVisibled)
        .map((action) => {
          const actionInfo: ActionInfo = {
            trigger: <div>{action.actionName || action.actionKey}</div>,
            componentKey,
            ...action,
            data: { ...node.data },
          };
          const recordActionAvailableFlags =
            node.data.recordActionAvailableFlags as Record<string, boolean>;
          if (
            recordActionAvailableFlags &&
            recordActionAvailableFlags[action.actionKey] === false
          ) {
            return null;
          }
          if (action.refresh) {
            if (asyncTree) {
              actionInfo.callback = async () => {
                await asyncLoadData(node);
                onRecordClick?.({...node.data});
              }
            } else {
              actionInfo.callback = async () => {
                await initLoadData();
                onRecordClick?.({...node.data});
              }
            }
          }
          return {
            key: action.actionKey,
            label: buildAction(actionInfo),
          };
        })
        .filter(Boolean);
        let actionMenu = null;
        if(items.length) {
          actionMenu = <Dropdown menu={{ items }} trigger={["hover"]}>
              <MoreOutlined />
            </Dropdown>
        }
      return (
        <>
          <span>{node.title}</span>
          <span style={{ float: "right" }}>
            {actionMenu}
          </span>
        </>
      );
    };
  }

  if (searchable) {
    const onSearch = async (text: string) => {
      const res = await doApiAction({
        componentKey,
        type: "API",
        actionKey: "loadSearchData",
        data: [text, input],
      });
      const options =
        res?.data?.map((item: any) => ({
          key: item[fieldNames.searchDataKey],
          value: item[fieldNames.searchDataTitle],
          record: item,
        })) || [];
      setSearchOptions(options);
    };

    const onExpand = (newExpandedKeys: React.Key[]) => {
      setExpandedKeys(newExpandedKeys);
      setAutoExpandParent(false);
    };

    const onSelect = async (value: string, item: { record: any }) => {
      const expandedTreeData: ExpandedTreeData = await doApiAction({
        componentKey,
        type: "API",
        actionKey: "loadExpandedTreeData",
        data: [item.record, input],
      });
      buildAndSetTreeData(expandedTreeData.data);
      setExpandedKeys(expandedTreeData.expandedKeys);
      setSelectedKeys([expandedTreeData.selectedRecord[fieldNames.key]]);
      onRecordClick?.(expandedTreeData.selectedRecord);
      setLoading(false);
      setAutoExpandParent(true);
    };
    treeProps.onExpand = onExpand;
    treeProps.expandedKeys = expandedKeys;
    treeProps.autoExpandParent = autoExpandParent;

    return (
      <div>
        {searchable && (
          <AutoComplete
            style={{ width: "100%", marginBottom: "10px" }}
            options={searchOptions}
            onSelect={onSelect}
            onSearch={onSearch}
            placeholder="快速查询"
          />
        )}
        <AntDTree {...treeProps} />
      </div>
    );
  }
  return <AntDTree {...treeProps} />;
};

export default FastballTree;
