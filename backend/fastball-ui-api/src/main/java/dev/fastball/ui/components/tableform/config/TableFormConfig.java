package dev.fastball.ui.components.tableform.config;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author gr@fastball.dev
 * @since 2023/5/15
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface TableFormConfig {

    int formColumn() default 2;

    String rowKey() default "id";

    boolean rowEditable() default true;

    boolean rowSelectable() default false;

    boolean defaultSelected() default false;

    String formTitle() default "";

    boolean showReset() default true;
}
