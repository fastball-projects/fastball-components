package dev.fastball.ui.components.compiler.chart;


import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.exception.CompilerException;
import dev.fastball.core.component.Component;
import dev.fastball.ui.components.metadata.chart.ChartProps;
import dev.fastball.ui.components.metadata.chart.ChartProps_AutoValue;
import dev.fastball.ui.components.metadata.chart.ChartType;
import dev.fastball.ui.components.chart.config.AreaChartConfig;
import dev.fastball.ui.components.chart.config.BarChartConfig;
import dev.fastball.ui.components.chart.config.ColumnChartConfig;
import dev.fastball.ui.components.chart.config.LineChartConfig;

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
        ChartProps.ChartFieldNames fieldNames = null;
        AreaChartConfig areaChartConfig = compileContext.getComponentElement().getAnnotation(AreaChartConfig.class);
        if (areaChartConfig != null) {
            props.type(ChartType.Area);
            fieldNames = new ChartProps.ChartFieldNames(areaChartConfig.xField(), areaChartConfig.yField(), areaChartConfig.seriesField());
        }
        BarChartConfig barChartConfig = compileContext.getComponentElement().getAnnotation(BarChartConfig.class);
        if (barChartConfig != null) {
            props.type(ChartType.Bar);
            fieldNames = new ChartProps.ChartFieldNames(barChartConfig.xField(), barChartConfig.yField(), barChartConfig.seriesField());
        }
        ColumnChartConfig columnChartConfig = compileContext.getComponentElement().getAnnotation(ColumnChartConfig.class);
        if (columnChartConfig != null) {
            props.type(ChartType.Column);
            fieldNames = new ChartProps.ChartFieldNames(columnChartConfig.xField(), columnChartConfig.yField(), columnChartConfig.seriesField());
        }
        LineChartConfig lineChartConfig = compileContext.getComponentElement().getAnnotation(LineChartConfig.class);
        if (lineChartConfig != null) {
            props.type(ChartType.Line);
            fieldNames = new ChartProps.ChartFieldNames(lineChartConfig.xField(), lineChartConfig.yField(), lineChartConfig.seriesField());
        }
        if (fieldNames == null) {
            String message = String.format("Chart component [%s] must add annotation @AreaChartConfig, @BarChartConfig, @ColumnChartConfig or @LineChartConfig", compileContext.getComponentElement().getQualifiedName());
            throw new CompilerException(message);
        }
        props.fieldNames(fieldNames);
    }

    @Override
    public String getComponentName() {
        return COMPONENT_TYPE;
    }
}
