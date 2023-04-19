package dev.fastball.ui.components.form.config;

import dev.fastball.core.info.basic.DisplayType;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ViewFormFieldsConfig {

    FieldConfig[] value();

    @Target({})
    @Retention(RetentionPolicy.RUNTIME)
    @interface FieldConfig {
        String field();

        DisplayType displayType();

        FieldDependencies fieldDependencies() default @FieldDependencies({});
    }
}
