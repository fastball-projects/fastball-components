package dev.fastball.ui.components.layout.config;

import dev.fastball.core.component.Component;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author gr@fastball.dev
 * @since 2023/1/30
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface LeftAndRight {
    Class<? extends Component> left();

    Class<? extends Component> right();

    boolean interlocking() default false;
}
