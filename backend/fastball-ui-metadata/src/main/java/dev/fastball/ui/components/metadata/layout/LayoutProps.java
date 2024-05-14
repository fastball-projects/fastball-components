package dev.fastball.ui.components.metadata.layout;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import dev.fastball.auto.value.annotation.AutoValue;
import dev.fastball.meta.component.ComponentProps;
import dev.fastball.meta.component.ReferencedComponentInfo;

import java.util.List;

/**
 * @author gr@fastball.dev
 * @since 2022/12/19
 */
@JsonDeserialize(using = LayoutPropsDeserializer.class)
public interface LayoutProps extends ComponentProps {
    LayoutType layoutType();

    boolean interlocking();
}







