package dev.fastball.ui.components.timeline;

import dev.fastball.core.annotation.Action;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author gr@fastball.dev
 * @since 2023/1/8
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface TimelineConfig {

    String keyField();

    String titleField();

    String timeField() default "";

    String colorField() default "";

    Action[] recordActions() default {};
}
