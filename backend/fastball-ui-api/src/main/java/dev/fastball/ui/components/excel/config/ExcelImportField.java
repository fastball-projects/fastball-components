package dev.fastball.ui.components.excel.config;


import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ExcelImportField {
    boolean ignore() default false;

    /**
     * 会显示在模板中第一行的提示信息
     *
     * @return 模板提示信息
     */
    String templateTips() default "";


    /**
     * 会显示在表头中的提示信息
     * @return 表头提示信息
     */
    String headerTips() default "";
}
