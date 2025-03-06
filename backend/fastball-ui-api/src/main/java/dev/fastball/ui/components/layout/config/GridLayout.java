package dev.fastball.ui.components.layout.config;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author gr@fastball.dev
 * @since 2023/1/30
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface GridLayout {

    /**
     * @return 网格布局的格子内容
     */
    GridCell[] cells();

    /**
     * @return 网格布局的列数
     */
    int cols() default 12;

    /**
     * @return 网格的每一行的高度
     */
    int rowHeight() default 32;

    /**
     * @return 网格的列之间的间距
     */
    int colMargin() default 16;

    /**
     * @return 网格的行之间的间距
     */
    int rowMargin() default 16;

    /**
     * @return 是否可以改变大小
     */
    boolean resizable() default false;

    /**
     * @return 是否可以拖动
     */
    boolean draggable() default false;
}
