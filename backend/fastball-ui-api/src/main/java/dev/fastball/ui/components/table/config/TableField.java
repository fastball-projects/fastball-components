package dev.fastball.ui.components.table.config;

import dev.fastball.core.info.basic.DisplayType;

import java.lang.annotation.*;

@Documented
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface TableField {

    int width() default 100;

    boolean copyable() default false;

    boolean sortable() default false;

    DisplayType display() default DisplayType.Show;
}
