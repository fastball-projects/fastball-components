package dev.fastball.ui.components.description.config;

import dev.fastball.meta.basic.DisplayType;

import java.lang.annotation.*;

@Documented
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface DescriptionField {
    /**
     * @return 该字段在详情页的展示类型
     */
    DisplayType display() default DisplayType.Show;
}
