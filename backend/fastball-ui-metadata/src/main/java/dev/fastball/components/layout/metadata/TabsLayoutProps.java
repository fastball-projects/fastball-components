package dev.fastball.components.layout.metadata;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import dev.fastball.auto.value.annotation.AutoValue;

import java.util.List;

@AutoValue
@JsonDeserialize
public interface TabsLayoutProps extends LayoutProps {
    LayoutType layoutType = LayoutType.Tabs;

    List<TabItemProps_AutoValue> items();

    int defaultActiveTab();
}