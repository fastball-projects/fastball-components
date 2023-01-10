package dev.fastball.ui.components.description.compiler;

import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.utils.ElementCompileUtils;
import dev.fastball.compile.utils.TypeCompileUtils;
import dev.fastball.core.annotation.Action;
import dev.fastball.core.component.Component;
import dev.fastball.core.info.action.ActionInfo;
import dev.fastball.core.info.action.PopupActionInfo;
import dev.fastball.ui.components.description.DescriptionConfig;
import dev.fastball.ui.components.description.DescriptionProps_AutoValue;
import dev.fastball.ui.components.description.DescriptionSize;

import javax.lang.model.element.TypeElement;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * @author gr@fastball.dev
 * @since 2022/12/14
 */
public abstract class AbstractDescriptionCompiler<T extends Component> extends AbstractComponentCompiler<T, DescriptionProps_AutoValue> {
    private static final String COMPONENT_TYPE = "FastballDescription";

    @Override
    protected DescriptionProps_AutoValue buildProps(CompileContext compileContext) {
        return new DescriptionProps_AutoValue();
    }

    @Override
    protected void compileProps(DescriptionProps_AutoValue props, CompileContext compileContext) {
        List<TypeElement> genericTypes = getGenericTypes(compileContext);
        props.fields(TypeCompileUtils.compileTypeFields(genericTypes.get(0), compileContext.getProcessingEnv(), props));
        compileRecordActions(compileContext, props);
        DescriptionConfig config = compileContext.getComponentElement().getAnnotation(DescriptionConfig.class);
        if (config != null) {
            props.size(config.size());
            props.column(config.column());
        } else {
            props.size(DescriptionSize.Default);
            props.column(2);
        }
    }

    @Override
    public String getComponentName() {
        return COMPONENT_TYPE;
    }

    protected void compileRecordActions(CompileContext compileContext, DescriptionProps_AutoValue props) {
        List<ActionInfo> actionInfoList = ElementCompileUtils.getMethods(compileContext.getComponentElement(), compileContext.getProcessingEnv())
                .values().stream().map(this::buildActionInfo).filter(Objects::nonNull).collect(Collectors.toList());
        props.actions(actionInfoList);
        DescriptionConfig config = compileContext.getComponentElement().getAnnotation(DescriptionConfig.class);
        if (config != null) {
            int index = 1;
            for (Action action : config.buttons()) {
                PopupActionInfo actionInfo = buildPopupActionInfo(action, props, "button" + index++);
                actionInfoList.add(actionInfo);
            }
        }
        props.actions(actionInfoList);
    }
}
