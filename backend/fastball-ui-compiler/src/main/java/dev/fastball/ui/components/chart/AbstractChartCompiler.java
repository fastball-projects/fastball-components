package dev.fastball.ui.components.chart;


import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.exception.CompilerException;
import dev.fastball.core.component.Component;
import dev.fastball.ui.components.chart.config.ChartConfig;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
public abstract class AbstractChartCompiler<T extends Component> extends AbstractComponentCompiler<T, ChartProps_AutoValue> {

    private static final String COMPONENT_TYPE = "FastballChart";

    @Override
    protected ChartProps_AutoValue buildProps(CompileContext compileContext) {
        return new ChartProps_AutoValue();
    }

    @Override
    protected void compileProps(ChartProps_AutoValue props, CompileContext compileContext) {
        ChartConfig config = compileContext.getComponentElement().getAnnotation(ChartConfig.class);
        if (config == null) {
            String message = String.format("Chart component [%s] must add annotation @ChartConfig", compileContext.getComponentElement().getQualifiedName());
            throw new CompilerException(message);
        }
        ChartProps.ChartFieldNames fieldNames = new ChartProps.ChartFieldNames(config.xField(), config.yField(), config.seriesField());
        props.fieldNames(fieldNames);
        props.type(config.type());
    }

    @Override
    public String getComponentName() {
        return COMPONENT_TYPE;
    }
}
