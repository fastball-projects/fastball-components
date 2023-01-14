package dev.fastball.ui.components.timeline.compiler;


import com.google.auto.service.AutoService;
import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.compile.utils.ElementCompileUtils;
import dev.fastball.core.annotation.ViewAction;
import dev.fastball.core.info.action.ActionInfo;
import dev.fastball.ui.components.timeline.Timeline;
import dev.fastball.ui.components.timeline.TimelineProps;
import dev.fastball.ui.components.timeline.TimelineProps_AutoValue;
import dev.fastball.ui.components.timeline.config.TimelineConfig;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
@AutoService(value = ComponentCompiler.class)
public class TimelineCompiler extends AbstractComponentCompiler<Timeline<?, ?>, TimelineProps_AutoValue> {

    private static final String COMPONENT_TYPE = "FastballTimeline";

    @Override
    protected TimelineProps_AutoValue buildProps(CompileContext compileContext) {
        return new TimelineProps_AutoValue();
    }

    @Override
    protected void compileProps(TimelineProps_AutoValue props, CompileContext compileContext) {
        TimelineConfig config = compileContext.getComponentElement().getAnnotation(TimelineConfig.class);
        TimelineProps.TimelineFieldNames fieldNames = TimelineProps.TimelineFieldNames.DEFAULT;
        if (config != null) {
            fieldNames = new TimelineProps.TimelineFieldNames(config.keyField(), config.titleField(), config.timeField(), config.colorField());
            compileRecordActions(compileContext, props);
        }
        props.fieldNames(fieldNames);
    }

    @Override
    public String getComponentName() {
        return COMPONENT_TYPE;
    }

    private void compileRecordActions(CompileContext compileContext, TimelineProps_AutoValue props) {
        List<ActionInfo> recordActions = ElementCompileUtils
                .getMethods(compileContext.getComponentElement(), compileContext.getProcessingEnv()).values().stream()
                .map(this::buildRecordActionInfo).filter(Objects::nonNull).collect(Collectors.toList());
        TimelineConfig config = compileContext.getComponentElement().getAnnotation(TimelineConfig.class);
        if (config != null) {
            int index = 1;
            for (ViewAction action : config.recordActions()) {
                ActionInfo actionInfo = buildViewActionInfo(action, props, "button" + index++);
                recordActions.add(actionInfo);
            }
        }
        props.recordActions(recordActions);
    }
}
