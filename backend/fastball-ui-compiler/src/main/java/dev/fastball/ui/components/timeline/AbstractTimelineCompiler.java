package dev.fastball.ui.components.timeline;


import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.core.component.Component;
import dev.fastball.ui.components.timeline.config.TimelineConfig;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
public abstract class AbstractTimelineCompiler<T extends Component> extends AbstractComponentCompiler<T, TimelineProps_AutoValue> {

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
            fieldNames = new TimelineProps.TimelineFieldNames(config.keyField(), config.leftField(), config.rightField(), config.colorField());
        }
        props.fieldNames(fieldNames);
    }

    @Override
    public String getComponentName() {
        return COMPONENT_TYPE;
    }
}
