package dev.fastball.ui.components.form.config;

import dev.fastball.meta.basic.DisplayType;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface FormField {
    /**
     * @return 该字段在只读模式下的展示类型
     */
    DisplayType readonlyDisplay() default DisplayType.Show;

    /**
     * @return 该字段在编辑模式下的展示类型
     */
    DisplayType editableDisplay() default DisplayType.Show;

    String addonBefore() default "";

    String addonAfter() default "";
}
