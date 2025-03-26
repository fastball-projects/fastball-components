import React, { useEffect } from "react";
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

import { TabsLayoutProps } from "../../../types";
import { loadRefComponent } from "../../common";

const TabsLayout: React.FC<TabsLayoutProps> = ({ items, defaultActiveTab, keepAlive, input }) => {
    const [tabsItems, setTabsItems] = React.useState<TabsProps['items']>([]);
    useEffect(() => {
        setTabsItems(items.map((item, index) => ({
            key: index.toString(),
            label: item.label,
            children: loadRefComponent(item.component, { __designMode: false, input: Object.assign({}, input, item.input) })
        })));
    }, []);
    return <Tabs destroyInactiveTabPane={!keepAlive} defaultActiveKey={defaultActiveTab.toString()} items={tabsItems} />
};

export default TabsLayout;