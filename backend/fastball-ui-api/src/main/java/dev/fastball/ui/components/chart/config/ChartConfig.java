package dev.fastball.ui.components.chart.config;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author gr@fastball.dev
 * @since 2023/1/29
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ChartConfig {

    ChartType type();

    String xField();

    String yField();

    String seriesField() default "";
}
