package dev.fastball.ui.components.compiler.tableform;

import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.exception.CompilerException;
import dev.fastball.compile.utils.TypeCompileUtils;
import dev.fastball.core.component.Component;
import dev.fastball.ui.components.metadata.form.FieldDependencyInfo;
import dev.fastball.ui.components.form.config.FieldDependencies;
import dev.fastball.ui.components.form.config.FieldDependency;
import dev.fastball.ui.components.metadata.tableform.TableFormFieldInfo;
import dev.fastball.ui.components.metadata.tableform.TableFormProps_AutoValue;
import dev.fastball.ui.components.tableform.config.TableFormConfig;
import dev.fastball.ui.components.tableform.config.TableFormField;

import javax.lang.model.element.TypeElement;
import javax.lang.model.element.VariableElement;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author gr@fastball.dev
 * @since 2022/12/14
 */
public abstract class AbstractTableFormCompiler<T extends Component> extends AbstractComponentCompiler<T, TableFormProps_AutoValue> {
    private static final String COMPONENT_TYPE = "FastballTableForm";

    @Override
    protected TableFormProps_AutoValue buildProps(CompileContext compileContext) {
        return new TableFormProps_AutoValue();
    }

    @Override
    protected void compileProps(TableFormProps_AutoValue props, CompileContext compileContext) {
        List<TypeElement> genericTypes = getGenericTypeElements(compileContext);
        TableFormConfig config = compileContext.getComponentElement().getAnnotation(TableFormConfig.class);
        if (config != null) {
            props.showReset(config.showReset());
            props.column(config.formColumn());
            props.rowKey(config.rowKey());
            props.rowSelectable(config.rowSelectable());
            props.rowEditable(config.rowEditable());
            props.defaultSelected(config.defaultSelected());
            if (!config.childrenFieldName().isEmpty()) {
                props.childrenFieldName(config.childrenFieldName());
            }
        } else {
            props.rowSelectable(false);
            props.rowEditable(false);
            props.showReset(true);
        }
        props.fields(TypeCompileUtils.compileTypeFields(genericTypes.get(0), compileContext.getProcessingEnv(), props, TableFormFieldInfo::new, ((variableElement, formFieldInfo) -> afterFieldBuild(props, variableElement, formFieldInfo))));
    }

    @Override
    public String getComponentName() {
        return COMPONENT_TYPE;
    }

    private void afterFieldBuild(TableFormProps_AutoValue props, VariableElement variableElement, TableFormFieldInfo fieldInfo) {
        TableFormField formField = variableElement.getAnnotation(TableFormField.class);
        if (formField != null) {
            fieldInfo.setSortable(formField.sortable());
            fieldInfo.setCopyable(formField.copyable());
            fieldInfo.setHideInTable(formField.hideInTable());
            fieldInfo.setHideInForm(formField.hideInForm());
            fieldInfo.setEditInTable(formField.editInTable());
            fieldInfo.setEditInForm(formField.editInForm());
        } else {
            fieldInfo.setEditInForm(true);
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

}
