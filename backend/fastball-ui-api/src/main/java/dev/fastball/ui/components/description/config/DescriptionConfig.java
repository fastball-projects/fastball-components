package dev.fastball.ui.components.description.config;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author gr@fastball.dev
 * @since 2023/1/9
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface DescriptionConfig {
    int column() default 2;

    DescriptionSize size() default DescriptionSize.Default;
}
