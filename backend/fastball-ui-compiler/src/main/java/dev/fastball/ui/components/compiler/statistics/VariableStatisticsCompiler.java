package dev.fastball.ui.components.compiler.statistics;


import com.google.auto.service.AutoService;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.ui.components.metadata.statistics.StatisticsProps_AutoValue;
import dev.fastball.ui.components.statistics.VariableStatistics;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
@AutoService(value = ComponentCompiler.class)
public class VariableStatisticsCompiler extends AbstractStatisticsCompiler<VariableStatistics<?, ?>> {
    @Override
    protected StatisticsProps_AutoValue buildProps(CompileContext compileContext) {
        StatisticsProps_AutoValue props = new StatisticsProps_AutoValue();
        props.variableStatistics(true);
        return props;
    }
}
