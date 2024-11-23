import React, { useEffect } from "react";
import { TabsLayoutProps } from "../../../types";
import { loadRefComponent } from "../../common";

import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

const TabsLayout: React.FC<TabsLayoutProps> = ({ items, defaultActiveTab, input }) => {
    const [tabsItems, setTabsItems] = React.useState<TabsProps['items']>([]);
    useEffect(() => {
        setTabsItems(items.map((item, index) => ({
            key: index.toString(),
            label: item.label,
            children: loadRefComponent(item.component, { __designMode: false, input })
        })));
    }, []);

    return <Tabs defaultActiveKey={defaultActiveTab.toString()} items={tabsItems} />
};

export default TabsLayout;