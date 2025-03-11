package dev.fastball.components.layout.metadata;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import dev.fastball.meta.component.ComponentProps;

/**
 * @author gr@fastball.dev
 * @since 2022/12/19
 */
@JsonDeserialize(using = LayoutPropsDeserializer.class)
public interface LayoutProps extends ComponentProps {
    LayoutType layoutType();

    boolean interlocking();
}







