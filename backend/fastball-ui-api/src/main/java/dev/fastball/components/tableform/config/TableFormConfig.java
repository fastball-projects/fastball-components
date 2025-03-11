package dev.fastball.components.tableform.config;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author gr@fastball.dev
 * @since 2023/5/15
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface TableFormConfig {

    int formColumn() default 2;

    String rowKey() default "id";

    /**
     * 如果希望是一个树状列表, 可以配置自己录字段名, 并保证该字段类型为当前类型的集合
     *
     * @return 属性表格的子记录字段名
     */
    String childrenFieldName() default "";

    boolean rowEditable() default false;

    boolean rowSelectable() default false;

    boolean defaultSelected() default false;

    String formTitle() default "";

    boolean showReset() default true;
}
