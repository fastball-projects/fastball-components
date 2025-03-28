package dev.fastball.components.compiler.chart;


import com.google.auto.service.AutoService;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.components.chart.Chart;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
@AutoService(value = ComponentCompiler.class)
public class ChartCompiler extends AbstractChartCompiler<Chart<?>> {
}
