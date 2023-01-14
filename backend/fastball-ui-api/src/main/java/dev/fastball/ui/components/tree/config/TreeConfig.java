package dev.fastball.ui.components.tree.config;

import dev.fastball.core.annotation.ViewAction;

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
public @interface TreeConfig {

    String keyField() default "id";

    String titleField() default "title";

    String childrenField() default "children";

    boolean defaultExpandAll() default false;

    ViewAction[] recordActions() default {};
}
