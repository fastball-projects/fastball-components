package dev.fastball.ui.components.form.compiler;

import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.exception.CompilerException;
import dev.fastball.compile.utils.ElementCompileUtils;
import dev.fastball.compile.utils.TypeCompileUtils;
import dev.fastball.core.component.Component;
import dev.fastball.ui.components.form.FieldDependencyInfo;
import dev.fastball.ui.components.form.FormFieldInfo;
import dev.fastball.ui.components.form.FormProps_AutoValue;
import dev.fastball.ui.components.form.ValueChangeHandlerInfo;
import dev.fastball.ui.components.form.config.*;

import javax.lang.model.element.ExecutableElement;
import javax.lang.model.element.TypeElement;
import javax.lang.model.element.VariableElement;
import java.util.Arrays;
import java.util.Collections;
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
        List<TypeElement> genericTypes = getGenericTypeElements(compileContext);
        props.fields(TypeCompileUtils.compileTypeFields(genericTypes.get(0), compileContext.getProcessingEnv(), props, FormFieldInfo::new, this::afterFieldBuild));
        compileOnValueChange(props, compileContext);
        FormConfig config = compileContext.getComponentElement().getAnnotation(FormConfig.class);
        if (config != null) {
            props.showReset(config.showReset());
            props.column(config.column());
            props.readonly(config.readonly());
        } else {
            props.showReset(true);
        }
    }

    @Override
    public String getComponentName() {
        return COMPONENT_TYPE;
    }

    private void afterFieldBuild(VariableElement variableElement, FormFieldInfo fieldInfo) {
        FieldDependencies fieldDependencies = variableElement.getAnnotation(FieldDependencies.class);
        FieldDependency fieldDependency = variableElement.getAnnotation(FieldDependency.class);
        if (fieldDependencies != null && fieldDependency != null) {
            String message = String.format("Form component [%s] cannot have both @FieldDependency and @FieldDependencies.", variableElement.getEnclosingElement());
            throw new CompilerException(message);
        }
        if (fieldDependencies != null) {
            fieldInfo.setConditionComposeType(fieldDependencies.composeType());
            fieldInfo.setFieldDependencyType(fieldDependencies.type());
            fieldInfo.setFieldDependencyInfoList(Arrays.stream(fieldDependencies.value()).map(this::buildFieldDependencyInfo).collect(Collectors.toList()));
        }
        if (fieldDependency != null) {
            fieldInfo.setFieldDependencyType(fieldDependency.type());
            fieldInfo.setFieldDependencyInfoList(Collections.singletonList(buildFieldDependencyInfo(fieldDependency)));
        }
    }

    private FieldDependencyInfo buildFieldDependencyInfo(FieldDependency fieldDependency) {
        return FieldDependencyInfo.builder().field(fieldDependency.field()).value(fieldDependency.value()).condition(fieldDependency.condition()).build();
    }

    private void compileOnValueChange(FormProps_AutoValue props, CompileContext compileContext) {
        List<ValueChangeHandlerInfo> valueChangeHandlers = compileContext.getMethodMap().values().stream().map(this::buildValueChangeHandlerInfo).filter(Objects::nonNull).collect(Collectors.toList());
        List<String> allWatchFields = valueChangeHandlers.stream().flatMap(info -> Arrays.stream(info.getWatchFields())).collect(Collectors.toList());
        if (allWatchFields.size() != allWatchFields.stream().distinct().count()) {
            String message = String.format("Form component [%s] @ValueChangeHandler has duplicate watchFields.", compileContext.getComponentElement().getQualifiedName());
            throw new CompilerException(message);
        }
        props.valueChangeHandlers(valueChangeHandlers);
    }

    private ValueChangeHandlerInfo buildValueChangeHandlerInfo(ExecutableElement method) {
        ValueChangeHandler actionAnnotation = method.getAnnotation(ValueChangeHandler.class);
        if (actionAnnotation == null) {
            return null;
        }
        return ValueChangeHandlerInfo.builder().watchFields(actionAnnotation.watchFields()).handlerKey(method.getSimpleName().toString()).build();
    }
}
