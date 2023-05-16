package dev.fastball.ui.components.tableform.config;

import java.lang.annotation.*;

@Documented
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface TableFormField {

    boolean copyable() default false;

    boolean sortable() default false;

    boolean editInTable() default false;

    boolean editInForm() default true;

    boolean hideInTable() default false;

    boolean hideInForm() default false;
}
