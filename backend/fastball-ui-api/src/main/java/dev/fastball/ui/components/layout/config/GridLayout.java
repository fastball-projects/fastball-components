package dev.fastball.ui.components.layout.config;

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
public @interface GridLayout {
    GridCell[] cells();

    int cols() default 12;

    int rowHeight() default 32;

    boolean resizable() default false;

    boolean draggable() default false;
}
