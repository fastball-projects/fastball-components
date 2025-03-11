package dev.fastball.components.compiler.statistics;


import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.utils.ElementCompileUtils;
import dev.fastball.components.statistics.metadata.StatisticsFieldInfo;
import dev.fastball.components.statistics.metadata.StatisticsProps_AutoValue;
import dev.fastball.core.component.Component;
import dev.fastball.components.statistics.config.StatisticsField;

import javax.lang.model.element.TypeElement;
import javax.lang.model.element.VariableElement;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
public abstract class AbstractStatisticsCompiler<T extends Component> extends AbstractComponentCompiler<T, StatisticsProps_AutoValue> {

    private static final String COMPONENT_TYPE = "FastballStatistics";

    @Override
    protected StatisticsProps_AutoValue buildProps(CompileContext compileContext) {
        return new StatisticsProps_AutoValue();
    }

    @Override
    protected void compileProps(StatisticsProps_AutoValue props, CompileContext compileContext) {
        List<TypeElement> genericTypes = getGenericTypeElements(compileContext);
        Map<String, VariableElement> fieldMap = ElementCompileUtils.getFields(genericTypes.get(0), compileContext.getProcessingEnv());
        List<StatisticsFieldInfo> fields = fieldMap.entrySet().stream()
                .map(field -> compileField(field.getKey(), field.getValue()))
                .collect(Collectors.toList());
        props.fields(fields);
    }

    @Override
    public String getComponentName() {
        return COMPONENT_TYPE;
    }

    protected StatisticsFieldInfo compileField(String name, VariableElement fieldElement) {
        StatisticsField statisticsField = fieldElement.getAnnotation(StatisticsField.class);
        if (statisticsField == null) {
            return null;
        }
        StatisticsFieldInfo statisticsFieldInfo = new StatisticsFieldInfo();
        statisticsFieldInfo.setName(name);
        statisticsFieldInfo.setTitle(statisticsField.title());
        statisticsFieldInfo.setColor(statisticsField.color());
        statisticsFieldInfo.setPrecision(statisticsField.precision());
        statisticsFieldInfo.setPrefix(statisticsField.prefix());
        statisticsFieldInfo.setSuffix(statisticsField.suffix());
        return statisticsFieldInfo;
    }
}
