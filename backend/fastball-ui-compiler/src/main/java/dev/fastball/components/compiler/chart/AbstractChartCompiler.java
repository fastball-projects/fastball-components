package dev.fastball.components.compiler.chart;


import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.exception.CompilerException;
import dev.fastball.components.chart.metadata.ChartProps;
import dev.fastball.components.chart.metadata.ChartProps_AutoValue;
import dev.fastball.components.chart.metadata.ChartType;
import dev.fastball.core.component.Component;
import dev.fastball.components.chart.config.*;

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
            props.title(areaChartConfig.title());
            props.palette(areaChartConfig.palette());
            props.bordered(areaChartConfig.bordered());
            props.borderColor(areaChartConfig.borderColor());
            fieldNames = new ChartProps.ChartFieldNames(areaChartConfig.xField(), areaChartConfig.yField(), areaChartConfig.seriesField());
        }
        BarChartConfig barChartConfig = compileContext.getComponentElement().getAnnotation(BarChartConfig.class);
        if (barChartConfig != null) {
            props.type(ChartType.Bar);
            props.title(barChartConfig.title());
            props.palette(barChartConfig.palette());
            props.bordered(barChartConfig.bordered());
            props.borderColor(barChartConfig.borderColor());
            fieldNames = new ChartProps.ChartFieldNames(barChartConfig.xField(), barChartConfig.yField(), barChartConfig.seriesField());
        }
        ColumnChartConfig columnChartConfig = compileContext.getComponentElement().getAnnotation(ColumnChartConfig.class);
        if (columnChartConfig != null) {
            props.type(ChartType.Column);
            props.title(columnChartConfig.title());
            props.palette(columnChartConfig.palette());
            props.bordered(columnChartConfig.bordered());
            props.borderColor(columnChartConfig.borderColor());
            fieldNames = new ChartProps.ChartFieldNames(columnChartConfig.xField(), columnChartConfig.yField(), columnChartConfig.seriesField());
        }
        LineChartConfig lineChartConfig = compileContext.getComponentElement().getAnnotation(LineChartConfig.class);
        if (lineChartConfig != null) {
            props.type(ChartType.Line);
            props.title(lineChartConfig.title());
            props.palette(lineChartConfig.palette());
            props.bordered(lineChartConfig.bordered());
            props.borderColor(lineChartConfig.borderColor());
            fieldNames = new ChartProps.ChartFieldNames(lineChartConfig.xField(), lineChartConfig.yField(), lineChartConfig.seriesField());
        }
        PieChartConfig pieChartConfig = compileContext.getComponentElement().getAnnotation(PieChartConfig.class);
        if (pieChartConfig != null) {
            props.type(ChartType.Pie);
            props.title(pieChartConfig.title());
            props.palette(pieChartConfig.palette());
            props.bordered(pieChartConfig.bordered());
            props.borderColor(pieChartConfig.borderColor());
            fieldNames = new ChartProps.ChartFieldNames(pieChartConfig.valueField(), pieChartConfig.titleField(), null);
        }
        DonutChartConfig donutChartConfig = compileContext.getComponentElement().getAnnotation(DonutChartConfig.class);
        if (donutChartConfig != null) {
            props.type(ChartType.Donut);
            props.title(donutChartConfig.title());
            props.palette(donutChartConfig.palette());
            props.bordered(donutChartConfig.bordered());
            props.borderColor(donutChartConfig.borderColor());
            fieldNames = new ChartProps.ChartFieldNames(donutChartConfig.valueField(), donutChartConfig.titleField(), null);
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
