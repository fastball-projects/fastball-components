package dev.fastball.ui.components.form.compiler;

import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.exception.CompilerException;
import dev.fastball.compile.utils.ElementCompileUtils;
import dev.fastball.compile.utils.TypeCompileUtils;
import dev.fastball.core.annotation.Field;
import dev.fastball.core.annotation.RecordAction;
import dev.fastball.core.component.Component;
import dev.fastball.core.component.DownloadFile;
import dev.fastball.core.info.action.ActionInfo;
import dev.fastball.core.info.action.ApiActionInfo;
import dev.fastball.core.info.basic.FieldInfo;
import dev.fastball.ui.components.form.FieldDependencyInfo;
import dev.fastball.ui.components.form.FormFieldInfo;
import dev.fastball.ui.components.form.FormProps_AutoValue;
import dev.fastball.ui.components.form.ValueChangeHandlerInfo;
import dev.fastball.ui.components.form.config.*;
import org.springframework.util.StringUtils;

import javax.annotation.processing.ProcessingEnvironment;
import javax.lang.model.element.ExecutableElement;
import javax.lang.model.element.TypeElement;
import javax.lang.model.element.VariableElement;
import java.util.*;
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
        FormConfig config = compileContext.getComponentElement().getAnnotation(FormConfig.class);
        if (config != null) {
            props.showReset(config.showReset());
            props.column(config.column());
            props.readonly(config.readonly());
        } else {
            props.column(3);
            props.showReset(true);
        }
        props.fields(TypeCompileUtils.compileTypeFields(genericTypes.get(0), compileContext.getProcessingEnv(), props, FormFieldInfo::new, ((variableElement, formFieldInfo) -> afterFieldBuild(props, variableElement, formFieldInfo))));
        compileOnValueChange(props, compileContext);
        if (config != null) {
            compileComponentFields(props, config);
            compileSubTableRecordViewActions(props, config);
        }
        compileSubTableRecordActions(props, compileContext);
    }

    private void compileSubTableRecordViewActions(FormProps_AutoValue props, FormConfig config) {
        for (SubTableRecordViewAction subTableRecordViewAction : config.subTableViewActions()) {
            List<ActionInfo> actionInfoList = Arrays.stream(subTableRecordViewAction.recordActions())
                    .map(annotation -> buildViewActionInfo(annotation, props))
                    .collect(Collectors.toList());
            setFieldsSubTableRecordActionProps(props.fields(), subTableRecordViewAction.fields(), actionInfoList, 0);
        }
    }

    protected void compileSubTableRecordActions(FormProps_AutoValue props, CompileContext compileContext) {
        for (ExecutableElement method : compileContext.getMethodMap().values()) {
            SubTableRecordAction actionAnnotation = method.getAnnotation(SubTableRecordAction.class);
            if (actionAnnotation == null) {
                continue;
            }
            if (actionAnnotation.fields().length == 0) {
                throw new CompilerException("@SubTableRecordAction.fields cannot empty");
            }
            ApiActionInfo.ApiActionInfoBuilder builder = ApiActionInfo.builder()
                    .componentKey(props.componentKey())
                    .refresh(actionAnnotation.refresh())
                    .confirmMessage(actionAnnotation.confirmMessage())
                    .closePopupOnSuccess(actionAnnotation.closePopupOnSuccess())
                    .actionName(actionAnnotation.name())
                    .actionKey(actionAnnotation.key().isEmpty() ? method.getSimpleName().toString() : actionAnnotation.key());
            builder.uploadFileAction(method.getParameters().stream().anyMatch(param -> isUploadField(param.asType(), compileContext.getProcessingEnv())));
            if (method.getReturnType() != null) {
                TypeElement returnType = (TypeElement) compileContext.getProcessingEnv().getTypeUtils().asElement(method.getReturnType());
                builder.downloadFileAction(returnType != null && ElementCompileUtils.isAssignableFrom(DownloadFile.class, returnType, compileContext.getProcessingEnv()));
            }
            setFieldsSubTableRecordActionProps(props.fields(), actionAnnotation.fields(), Collections.singletonList(builder.build()), 0);
        }
    }

    protected void setFieldsSubTableRecordActionProps(List<FormFieldInfo> fieldInfoList, String[] subTableFields, List<ActionInfo> actionInfo, int index) {
        for (FormFieldInfo fieldInfo : fieldInfoList) {
            if (subTableFields[index].equals(fieldInfo.getDataIndex().get(0))) {
                if (index == subTableFields.length - 1) {
                    List<ActionInfo> subTableRecordActions = fieldInfo.getSubTableRecordActions();
                    if (subTableRecordActions == null) {
                        subTableRecordActions = new ArrayList<>();
                        fieldInfo.setSubTableRecordActions(subTableRecordActions);
                    }
                    subTableRecordActions.addAll(actionInfo);
                } else if (fieldInfo.getSubFields() != null) {
                    setFieldsSubTableRecordActionProps((List<FormFieldInfo>) fieldInfo.getSubFields(), subTableFields, actionInfo, index + 1);
                } else {
                    throw new CompilerException("@SubTableRecordAction.fields cannot found model field");
                }
            }
        }
    }

    @Override
    public String getComponentName() {
        return COMPONENT_TYPE;
    }


    protected void compileComponentFields(FormProps_AutoValue props, FormConfig formConfig) {
        Map<String, FormFieldConfig> fieldConfigMap = new HashMap<>();
        for (FormFieldConfig fieldConfig : formConfig.fieldsConfig()) {
            fieldConfigMap.put(fieldConfig.field(), fieldConfig);
        }
        for (FieldInfo field : props.fields()) {
            Optional<String> fieldName = field.getDataIndex().stream().findFirst();
            if (fieldName.isPresent() && fieldConfigMap.containsKey(fieldName.get())) {
                FormFieldConfig fieldConfig = fieldConfigMap.get(fieldName.get());
                field.setDisplay(fieldConfig.display());
                field.setReadonly(fieldConfig.readonly());
                if (StringUtils.hasLength(fieldConfig.title())) {
                    field.setTitle(fieldConfig.title());
                }
                field.setOrder(fieldConfig.order());
            }
        }
        props.fields(props.fields().stream().sorted().collect(Collectors.toList()));
    }


    private void afterFieldBuild(FormProps_AutoValue props, VariableElement variableElement, FormFieldInfo fieldInfo) {
        FormField formField = variableElement.getAnnotation(FormField.class);
        Field fieldAnnotation = variableElement.getAnnotation(Field.class);
        if (formField != null) {
            if (props.readonly() || (fieldAnnotation != null && fieldAnnotation.readonly())) {
                fieldInfo.setDisplay(formField.readonlyDisplay());
            } else {
                fieldInfo.setDisplay(formField.editableDisplay());
            }
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
