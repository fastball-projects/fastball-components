package dev.fastball.components.compiler.form;

import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.exception.CompilerException;
import dev.fastball.compile.utils.TypeCompileUtils;
import dev.fastball.components.form.config.FormListConfig;
import dev.fastball.components.form.metadata.*;
import dev.fastball.core.annotation.Field;
import dev.fastball.core.annotation.FieldPlaceholder;
import dev.fastball.core.component.Component;
import dev.fastball.meta.action.ActionInfo;
import dev.fastball.meta.basic.FieldInfo;
import dev.fastball.components.form.config.*;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import javax.lang.model.element.ExecutableElement;
import javax.lang.model.element.TypeElement;
import javax.lang.model.element.VariableElement;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * @author gr@fastball.dev
 * @since 2022/12/14
 */
public abstract class AbstractFormCompiler<T extends Component> extends AbstractComponentCompiler<T, WebFormProps_AutoValue> {
    private static final String COMPONENT_TYPE = "FastballForm";

    @Override
    protected WebFormProps_AutoValue buildProps(CompileContext compileContext) {
        return new WebFormProps_AutoValue();
    }

    @Override
    protected void compileProps(WebFormProps_AutoValue props, CompileContext compileContext) {
        List<TypeElement> genericTypes = getGenericTypeElements(compileContext);
        FormConfig config = compileContext.getComponentElement().getAnnotation(FormConfig.class);
        if (config != null) {
            props.showReset(config.showReset());
            props.column(config.column());
            props.layout(config.layout());
            if (config.readonly()) {
                props.readonly(true);
                props.showReset(false);
            }
        } else {
            props.column(2);
            props.layout(FormLayout.Vertical);
            props.showReset(true);
        }
        props.fields(TypeCompileUtils.compileTypeFields(genericTypes.get(0), compileContext.getProcessingEnv(), props, WebFormFieldInfo::new, ((variableElement, formFieldInfo) -> afterFieldBuild(props, variableElement, formFieldInfo))));
        compileOnValueChange(props, compileContext);
        if (config != null) {
            compileComponentFields(props, config);
        }
    }

    @Override
    public String getComponentName() {
        return COMPONENT_TYPE;
    }


    protected void compileComponentFields(WebFormProps_AutoValue props, FormConfig formConfig) {
        Map<String, FieldConfigOverrideInfo> fieldConfigMap = new HashMap<>();
        for (FormFieldConfig fieldConfig : formConfig.fieldsConfig()) {
            if (fieldConfig.field().length == 1) {
                fieldConfigMap.put(fieldConfig.field()[0], FieldConfigOverrideInfo.builder().config(fieldConfig).build());
            } else {
                FieldConfigOverrideInfo overrideInfo;
                if (fieldConfigMap.containsKey(fieldConfig.field()[0])) {
                    overrideInfo = fieldConfigMap.get(fieldConfig.field()[0]);
                } else {
                    overrideInfo = FieldConfigOverrideInfo.builder().subFieldsConfigMap(new HashMap<>()).build();
                    fieldConfigMap.put(fieldConfig.field()[0], overrideInfo);
                }
                for (int i = 1; i < fieldConfig.field().length - 1; i++) {
                    if (overrideInfo.getSubFieldsConfigMap().containsKey(fieldConfig.field()[i])) {
                        overrideInfo = overrideInfo.getSubFieldsConfigMap().get(fieldConfig.field()[i]);
                    } else {
                        FieldConfigOverrideInfo nextOverrideInfo = FieldConfigOverrideInfo.builder().subFieldsConfigMap(new HashMap<>()).build();
                        overrideInfo.getSubFieldsConfigMap().put(fieldConfig.field()[i], nextOverrideInfo);
                        overrideInfo = nextOverrideInfo;
                    }
                }
                overrideInfo.getSubFieldsConfigMap().put(fieldConfig.field()[fieldConfig.field().length - 1], FieldConfigOverrideInfo.builder().config(fieldConfig).build());
            }
        }
        overrideFields(props.fields(), fieldConfigMap);
        props.fields(props.fields().stream().sorted().collect(Collectors.toList()));
    }

    private void overrideFields(Collection<WebFormFieldInfo> fields, Map<String, FieldConfigOverrideInfo> fieldsConfigMap) {
        for (FieldInfo field : fields) {
            Optional<String> fieldName = field.getDataIndex().stream().findFirst();
            if (fieldName.isPresent() && fieldsConfigMap.containsKey(fieldName.get())) {
                FieldConfigOverrideInfo overrideInfo = fieldsConfigMap.get(fieldName.get());
                if (overrideInfo == null) {
                    continue;
                }
                if (overrideInfo.getConfig() != null) {
                    FormFieldConfig fieldConfig = overrideInfo.getConfig();
                    field.setDisplay(fieldConfig.display());
                    field.setReadonly(fieldConfig.readonly());
                    if (StringUtils.hasLength(fieldConfig.title())) {
                        field.setTitle(fieldConfig.title());
                    }
                    field.setOrder(fieldConfig.order());
                }
                if (!CollectionUtils.isEmpty(field.getSubFields()) && !CollectionUtils.isEmpty(overrideInfo.getSubFieldsConfigMap())) {
                    overrideFields((Collection<WebFormFieldInfo>) field.getSubFields(), overrideInfo.getSubFieldsConfigMap());
                }
            }
        }
    }

    private void afterFieldBuild(WebFormProps_AutoValue props, VariableElement variableElement, WebFormFieldInfo fieldInfo) {
        FormField formField = variableElement.getAnnotation(FormField.class);
        Field fieldAnnotation = variableElement.getAnnotation(Field.class);
        if (formField != null) {
            if (props.readonly() || (fieldAnnotation != null && fieldAnnotation.readonly())) {
                fieldInfo.setDisplay(formField.readonlyDisplay());
            } else {
                fieldInfo.setDisplay(formField.editableDisplay());
            }
            fieldInfo.setAddonBefore(formField.addonBefore());
            fieldInfo.setAddonAfter(formField.addonAfter());
            fieldInfo.setPlaceholder(formField.placeholder());
        }
        FieldPlaceholder fieldPlaceholder = variableElement.getAnnotation(FieldPlaceholder.class);
        if (fieldPlaceholder != null) {
            fieldInfo.setPlaceholder(fieldPlaceholder.value());
        }
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
        FormListConfig formListConfig = variableElement.getAnnotation(FormListConfig.class);
        if (formListConfig != null) {
            fieldInfo.setSubTableCreatorButtonText(formListConfig.creatorButtonText());
            List<ActionInfo> actionInfoList = Arrays.stream(formListConfig.recordActions())
                    .map(annotation -> buildViewActionInfo(annotation, props))
                    .collect(Collectors.toList());
            fieldInfo.setSubTableRecordActions(actionInfoList);
        }


    }

    private FieldDependencyInfo buildFieldDependencyInfo(FieldDependency fieldDependency) {
        return FieldDependencyInfo.builder().field(fieldDependency.field()).value(fieldDependency.value()).condition(fieldDependency.condition()).build();
    }

    private void compileOnValueChange(WebFormProps_AutoValue props, CompileContext compileContext) {
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
