package dev.fastball.ui.components.metadata.layout;

import dev.fastball.auto.value.annotation.AutoValue;
import dev.fastball.meta.component.ReferencedComponentInfo;

/**
 * @author gr@fastball.dev
 * @since 2023/1/30
 */
@AutoValue
public interface GridCellProps {
    int x();

    int y();

    int width();

    int height();

    ReferencedComponentInfo component();
}
