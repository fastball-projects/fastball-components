package dev.fastball.ui.components.table.compiler;


import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.utils.ElementCompileUtils;
import dev.fastball.compile.utils.TypeCompileUtils;
import dev.fastball.core.annotation.Action;
import dev.fastball.core.component.Component;
import dev.fastball.core.info.action.ActionInfo;
import dev.fastball.core.info.action.PopupActionInfo;
import dev.fastball.ui.components.table.*;

import javax.annotation.processing.ProcessingEnvironment;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.TypeMirror;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static dev.fastball.compile.utils.ElementCompileUtils.getReferencedComponentInfo;

/**
 * @author gr@fastball.dev
 * @since 2022/12/30
 */
public abstract class AbstractTableCompiler<T extends Component> extends AbstractComponentCompiler<T, TableProps_AutoValue> {

    private static final String COMPONENT_TYPE = "FastballTable";

    protected boolean searchable() {
        return false;
    }

    @Override
    protected TableProps_AutoValue buildProps(CompileContext compileContext) {
        return new TableProps_AutoValue();
    }

    @Override
    protected void compileProps(TableProps_AutoValue props, CompileContext compileContext) {
        compileBasicConfig(compileContext, props);
        compileButtons(compileContext, props);
        compileRecordActions(compileContext, props);
    }

    @Override
    protected String getComponentName() {
        return COMPONENT_TYPE;
    }

    private List<ColumnInfo> buildTableColumnsFromReturnType(TypeElement returnType, ProcessingEnvironment processingEnv, TableProps_AutoValue props) {
        return TypeCompileUtils.compileTypeFields(returnType, processingEnv, props, ColumnInfo_AutoValue::new, (field, tableColumn) -> {
            TableColumnSortable sortable = field.getAnnotation(TableColumnSortable.class);
            if (sortable != null) {
                ((ColumnInfo_AutoValue) tableColumn).sortable(true);
            }
        });
    }

    private void compileRecordActions(CompileContext compileContext, TableProps_AutoValue props) {
        List<ActionInfo> recordActions = ElementCompileUtils
                .getMethods(compileContext.getComponentElement(), compileContext.getProcessingEnv()).values().stream()
                .map(this::buildActionInfo).filter(Objects::nonNull).collect(Collectors.toList());
        TableConfig tableConfig = compileContext.getComponentElement().getAnnotation(TableConfig.class);
        if (tableConfig != null) {
            int index = 1;
            for (Action action : tableConfig.recordActions()) {
                recordActions.add(buildPopupActionInfo(action, props, "button" + index++));
            }
        }
        props.recordActions(recordActions);
    }

    private void compileButtons(CompileContext compileContext, TableProps_AutoValue props) {
        TableConfig tableConfig = compileContext.getComponentElement().getAnnotation(TableConfig.class);
        if (tableConfig == null) {
            return;
        }
        List<ActionInfo> actionInfoList = new ArrayList<>();
        int index = 1;
        for (Action action : tableConfig.actions()) {
            PopupActionInfo popupActionInfo = buildPopupActionInfo(action, props, "button" + index++);
            actionInfoList.add(popupActionInfo);
        }
        props.actions(actionInfoList);
    }

    private void compileBasicConfig(CompileContext compileContext, TableProps_AutoValue props) {
        List<TypeElement> genericTypes = getGenericTypes(compileContext);

        props.columns(buildTableColumnsFromReturnType(genericTypes.get(0), compileContext.getProcessingEnv(), props));
        if (searchable()) {
            props.queryFields(TypeCompileUtils.compileTypeFields(genericTypes.get(1), compileContext.getProcessingEnv(), props));
        }

        TableConfig tableConfig = compileContext.getComponentElement().getAnnotation(TableConfig.class);
        if (tableConfig == null) {
            return;
        }
        TypeMirror rowExpandedComponent = ElementCompileUtils.getTypeMirrorFromAnnotationValue(tableConfig::rowExpandedComponent);
        if (rowExpandedComponent == null || !Component.class.getCanonicalName().equals(rowExpandedComponent.toString())) {
            TypeElement rowExpandedComponentElement = (TypeElement) compileContext.getProcessingEnv().getTypeUtils().asElement(rowExpandedComponent);
            props.rowExpandedComponent(getReferencedComponentInfo(props, rowExpandedComponentElement));
        }

        if (tableConfig.childrenFieldName().isEmpty()) {
            props.childrenFieldName(tableConfig.childrenFieldName());
        }
    }
}
