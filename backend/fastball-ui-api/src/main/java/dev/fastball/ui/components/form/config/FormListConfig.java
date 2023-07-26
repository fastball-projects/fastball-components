package dev.fastball.ui.components.form.config;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Form.List 和 SubTable 的配置
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface FormListConfig {

    /**
     * @return 新增一行的按钮文本
     */
    String creatorButtonText() default "添加一行数据";
}
