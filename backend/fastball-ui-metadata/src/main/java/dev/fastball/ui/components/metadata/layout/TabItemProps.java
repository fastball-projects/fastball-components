package dev.fastball.ui.components.metadata.layout;

import dev.fastball.auto.value.annotation.AutoValue;
import dev.fastball.meta.component.ReferencedComponentInfo;

/**
 * @author gr@fastball.dev
 */
@AutoValue
public interface TabItemProps {
    String label();

    ReferencedComponentInfo component();
}
