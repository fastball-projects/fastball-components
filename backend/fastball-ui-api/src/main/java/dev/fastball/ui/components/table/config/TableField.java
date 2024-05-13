package dev.fastball.ui.components.table.config;

import dev.fastball.meta.basic.DisplayType;

import java.lang.annotation.*;

@Documented
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface TableField {

    boolean copyable() default false;

    boolean sortable() default false;

    DisplayType display() default DisplayType.Show;
}
