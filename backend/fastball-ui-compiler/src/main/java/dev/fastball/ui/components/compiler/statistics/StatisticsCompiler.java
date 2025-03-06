package dev.fastball.ui.components.compiler.statistics;


import com.google.auto.service.AutoService;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.ui.components.statistics.Statistics;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
@AutoService(value = ComponentCompiler.class)
public class StatisticsCompiler extends AbstractStatisticsCompiler<Statistics<?>> {
}
