package dev.fastball.ui.components.form.config;

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
public @interface FormConfig {

    int column() default 3;

    String title() default "";

    boolean showReset() default true;

    boolean readonly() default false;

    FormFieldConfig[] fieldsConfig() default {};
}
