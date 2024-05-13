package dev.fastball.ui.components.form.config;

import dev.fastball.meta.basic.DisplayType;

import java.lang.annotation.*;

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
}
