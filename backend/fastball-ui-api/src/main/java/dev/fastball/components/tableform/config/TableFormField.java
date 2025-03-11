package dev.fastball.components.tableform.config;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface TableFormField {

    int width() default 0;

    boolean copyable() default false;

    boolean sortable() default false;

    boolean editInTable() default false;

    boolean editInForm() default true;

    boolean hideInTable() default false;

    boolean hideInForm() default false;

}
