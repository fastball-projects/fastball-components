package dev.fastball.ui.components.table.config;

import dev.fastball.meta.basic.DisplayType;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({})
@Retention(RetentionPolicy.RUNTIME)
public @interface TableFieldConfig {

    String field();

    String title() default "";

    int order() default 0;

    int width() default 0;

    boolean copyable() default false;

    boolean sortable() default false;

    DisplayType display() default DisplayType.Show;
}
