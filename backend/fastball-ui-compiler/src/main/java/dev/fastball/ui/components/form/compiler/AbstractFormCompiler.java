package dev.fastball.ui.components.form.compiler;

import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.utils.ElementCompileUtils;
import dev.fastball.compile.utils.TypeCompileUtils;
import dev.fastball.core.annotation.ViewAction;
import dev.fastball.core.component.Component;
import dev.fastball.core.info.action.ActionInfo;
import dev.fastball.ui.components.form.FormProps_AutoValue;
import dev.fastball.ui.components.form.config.FormConfig;

import javax.lang.model.element.TypeElement;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * @author gr@fastball.dev
 * @since 2022/12/14
 */
public abstract class AbstractFormCompiler<T extends Component> extends AbstractComponentCompiler<T, FormProps_AutoValue> {
    private static final String COMPONENT_TYPE = "FastballForm";

    @Override
    protected FormProps_AutoValue buildProps(CompileContext compileContext) {
        return new FormProps_AutoValue();
    }

    @Override
    protected void compileProps(FormProps_AutoValue props, CompileContext compileContext) {
        List<TypeElement> genericTypes = getGenericTypes(compileContext);
        props.fields(TypeCompileUtils.compileTypeFields(genericTypes.get(0), compileContext.getProcessingEnv(), props));
        compileRecordActions(compileContext, props);
        FormConfig config = compileContext.getComponentElement().getAnnotation(FormConfig.class);
        if (config != null) {
            props.showReset(config.showReset());
            props.readonly(config.readonly());
        } else {
            props.showReset(true);
        }
    }

    @Override
    public String getComponentName() {
        return COMPONENT_TYPE;
    }

    protected void compileRecordActions(CompileContext compileContext, FormProps_AutoValue props) {
        List<ActionInfo> actionInfoList = ElementCompileUtils.getMethods(compileContext.getComponentElement(), compileContext.getProcessingEnv())
                .values().stream().map(this::buildRecordActionInfo).filter(Objects::nonNull).collect(Collectors.toList());
        FormConfig config = compileContext.getComponentElement().getAnnotation(FormConfig.class);
        if (config != null) {
            int index = 1;
            for (ViewAction action : config.buttons()) {
                ActionInfo actionInfo = buildViewActionInfo(action, props, "button" + index++);
                actionInfoList.add(actionInfo);
            }
        }
        props.actions(actionInfoList);
    }
}
