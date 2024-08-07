package dev.fastball.ui.components.metadata.description;

import dev.fastball.auto.value.annotation.AutoValue;
import dev.fastball.meta.basic.FieldInfo;
import dev.fastball.meta.component.ComponentProps;
import dev.fastball.ui.components.description.config.DescriptionSize;

import java.util.List;

/**
 * @author gr@fastball.dev
 * @since 2022/12/14
 */
@AutoValue
public interface DescriptionProps extends ComponentProps {
    String headerTitle();

    Integer column();

    DescriptionSize size();

    boolean variableDescription();

    List<FieldInfo> fields();
}
