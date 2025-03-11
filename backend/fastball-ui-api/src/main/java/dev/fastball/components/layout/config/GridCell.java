package dev.fastball.components.layout.config;

import dev.fastball.core.component.Component;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author gr@fastball.dev
 * @since 2023/1/30
 */
@Target({})
@Retention(RetentionPolicy.RUNTIME)
public @interface GridCell {
    /**
     * @return 格子在网格中的 X 轴坐标
     */
    int x() default 0;

    /**
     * @return 格子在网格中的 Y 轴坐标
     */
    int y() default 0;

    /**
     * @return 格子在网格中的宽度, 即占几列
     */
    int width() default 6;


    /**
     * @return 格子在网格中的高度, 即占几行
     */
    int height() default 6;

    /**
     * @return 格子内的组件
     */
    Class<? extends Component> component();
}
