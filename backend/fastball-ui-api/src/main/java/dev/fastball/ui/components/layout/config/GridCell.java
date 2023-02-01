package dev.fastball.ui.components.layout.config;

import dev.fastball.core.component.Component;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author gr@fastball.dev
 * @since 2023/1/30
 */
@Target({})
@Retention(RetentionPolicy.RUNTIME)
public @interface GridCell {
    int x();

    int y();

    int width() default 6;

    int height() default 6;

    Class<? extends Component> component();
}
