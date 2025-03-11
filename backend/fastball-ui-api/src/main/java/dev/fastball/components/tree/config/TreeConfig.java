package dev.fastball.components.tree.config;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author gr@fastball.dev
 * @since 2023/1/8
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface TreeConfig {

    /**
     * @return 数据的标识字段, 默认是 id
     */
    String keyField() default "id";

    /**
     * @return 展示字段
     */
    String titleField();

    /**
     * @return 子字段, 用于声明树形数据的子孙数据字段
     */
    String childrenField();

    /**
     * @return 是否有子节点, 用于声明树形数据是否有子节点的字段, 为 false 时, 树无法再展看也不现实展开按钮
     */
    String hasChildrenField() default "hasChildren";

    /**
     * @return 搜索数据的标识字段, 默认是 id
     */
    String searchKeyField() default "id";

    /**
     * @return 搜索数据的展示字段
     */
    String searchTitleField() default "title";

    /**
     * @return 是否默认展开所有节点, 仅在同步树情况下生效
     */
    boolean defaultExpandAll() default false;
}
