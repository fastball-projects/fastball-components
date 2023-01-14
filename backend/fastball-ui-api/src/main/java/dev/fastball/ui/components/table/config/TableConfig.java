package dev.fastball.ui.components.table.config;

import dev.fastball.core.annotation.ViewAction;
import dev.fastball.core.component.Component;

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
public @interface TableConfig {
    String title() default "";

    /**
     * 如果希望是一个树状列表, 可以配置自己录字段名, 并保证该字段类型为当前类型的集合
     *
     * @return 属性表格的子记录字段名
     */
    String childrenFieldName() default "";

    Class<? extends Component> rowExpandedComponent() default Component.class;

    ViewAction[] actions() default {};

    ViewAction[] recordActions() default {};
}
