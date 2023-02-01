package dev.fastball.ui.components.chart;


import com.google.auto.service.AutoService;
import dev.fastball.compile.ComponentCompiler;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
@AutoService(value = ComponentCompiler.class)
public class VariableChartCompiler extends AbstractChartCompiler<VariableChart<?, ?>> {
}
