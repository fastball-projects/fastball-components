package dev.fastball.components.layout.metadata;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import dev.fastball.auto.value.annotation.AutoValue;
import dev.fastball.meta.component.ReferencedComponentInfo;

@AutoValue
@JsonDeserialize
interface TopAndBottomLayoutProps extends LayoutProps {
    LayoutType layoutType = LayoutType.TopAndBottom;

    ReferencedComponentInfo top();

    ReferencedComponentInfo bottom();
}