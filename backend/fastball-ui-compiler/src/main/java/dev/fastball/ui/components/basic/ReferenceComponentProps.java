package dev.fastball.ui.components.basic;

import dev.fastball.auto.value.annotation.AutoValue;
import dev.fastball.core.info.component.ComponentProps;
import dev.fastball.core.info.component.ReferencedComponentInfo;

/**
 * @author gr@fastball.dev
 * @since 2022/12/14
 */
@AutoValue
public interface ReferenceComponentProps extends ComponentProps {
    ReferencedComponentInfo component();
}
