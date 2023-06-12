package dev.fastball.ui.components.table.compiler;


import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.utils.ElementCompileUtils;
import dev.fastball.compile.utils.TypeCompileUtils;
import dev.fastball.core.component.Component;
import dev.fastball.core.info.action.ApiActionInfo;
import dev.fastball.core.info.basic.FieldInfo;
import dev.fastball.ui.components.table.ColumnInfo;
import dev.fastball.ui.components.table.TableProps_AutoValue;
import dev.fastball.ui.components.table.config.*;
import dev.fastball.ui.components.table.param.TableSearchParam;

import javax.annotation.processing.ProcessingEnvironment;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;
import javax.lang.model.type.TypeMirror;
import java.util.*;

import static dev.fastball.compile.utils.ElementCompileUtils.getReferencedComponentInfo;

/**
 * @author gr@fastball.dev
 * @since 2022/12/30
 */
public abstract class AbstractTableCompiler<T extends Component> extends AbstractComponentCompiler<T, TableProps_AutoValue> {

    private static final String COMPONENT_TYPE = "FastballTable";

    private static final String EXPORT_METHOD_NAME = "exportData";

    protected boolean searchable() {
        return false;
    }

    @Override
    protected TableProps_AutoValue buildProps(CompileContext compileContext) {
        return new TableProps_AutoValue();
    }

    @Override
    protected void compileProps(TableProps_AutoValue props, CompileContext compileContext) {
        List<? extends TypeMirror> genericTypes = getGenericTypes(compileContext);

        TypeElement returnType = (TypeElement) compileContext.getProcessingEnv().getTypeUtils().asElement(genericTypes.get(0));
        props.columns(buildTableColumnsFromReturnType(returnType, compileContext.getProcessingEnv(), props));
        if (searchable()) {
            TypeElement searchType = (TypeElement) compileContext.getProcessingEnv().getTypeUtils().asElement(genericTypes.get(1));
            if (Objects.equals(searchType.getQualifiedName().toString(), TableSearchParam.class.getCanonicalName())) {
                TypeMirror realSearchType = ((DeclaredType) genericTypes.get(1)).getTypeArguments().get(0);
                searchType = (TypeElement) compileContext.getProcessingEnv().getTypeUtils().asElement(realSearchType);
            }
            props.wrappedSearch(true);
            props.searchable(true);
            props.queryFields(TypeCompileUtils.compileTypeFields(searchType, compileContext.getProcessingEnv(), props));
        }

        TableConfig tableConfig = compileContext.getComponentElement().getAnnotation(TableConfig.class);
        if (tableConfig == null) {
            props.pageable(true);
            return;
        }
        TypeMirror rowExpandedComponent = ElementCompileUtils.getTypeMirrorFromAnnotationValue(tableConfig::rowExpandedComponent);
        if (rowExpandedComponent == null || !Component.class.getCanonicalName().equals(rowExpandedComponent.toString())) {
            TypeElement rowExpandedComponentElement = (TypeElement) compileContext.getProcessingEnv().getTypeUtils().asElement(rowExpandedComponent);
            props.rowExpandedComponent(getReferencedComponentInfo(props, rowExpandedComponentElement));
        }

        if (!tableConfig.childrenFieldName().isEmpty()) {
            props.childrenFieldName(tableConfig.childrenFieldName());
        }
        props.size(tableConfig.size());
        props.keywordSearch(tableConfig.keywordSearch());
        props.lightQuery(tableConfig.lightQuery());
        props.pageable(tableConfig.pageable());
        props.showRowIndex(tableConfig.showRowIndex());

        compileComponentFields(props, tableConfig);

        // 是否开启导出
        if (tableConfig.exportable()) {
            ApiActionInfo exportActionInfo = ApiActionInfo.builder()
                    .actionKey(EXPORT_METHOD_NAME)
                    .actionName("导出")
                    .downloadFileAction(true)
                    .build();
            props.actions().add(exportActionInfo);
        }
    }

    @Override
    protected String getComponentName() {
        return COMPONENT_TYPE;
    }


    protected void compileComponentFields(TableProps_AutoValue props, TableConfig tableConfig) {
        Map<String, TableFieldConfig> columnConfigMap = new HashMap<>();
        for (TableFieldConfig fieldConfig : tableConfig.columnsConfig()) {
            columnConfigMap.put(fieldConfig.field(), fieldConfig);
        }
        for (ColumnInfo field : props.columns()) {
            Optional<String> fieldName = field.getDataIndex().stream().findFirst();
            if (fieldName.isPresent() && columnConfigMap.containsKey(fieldName.get())) {
                TableFieldConfig fieldConfig = columnConfigMap.get(fieldName.get());
                field.setDisplay(fieldConfig.display());
                field.setTitle(fieldConfig.title());
                field.setOrder(fieldConfig.order());
            }
        }
        if (props.queryFields() != null) {
            Map<String, TableFieldConfig> queryFieldConfigMap = new HashMap<>();
            for (TableFieldConfig fieldConfig : tableConfig.queryFieldsConfig()) {
                queryFieldConfigMap.put(fieldConfig.field(), fieldConfig);
            }
            for (FieldInfo field : props.queryFields()) {
                Optional<String> fieldName = field.getDataIndex().stream().findFirst();
                if (fieldName.isPresent() && queryFieldConfigMap.containsKey(fieldName.get())) {
                    TableFieldConfig fieldConfig = queryFieldConfigMap.get(fieldName.get());
                    field.setDisplay(fieldConfig.display());
                    field.setTitle(fieldConfig.title());
                    field.setOrder(fieldConfig.order());
                }
            }
        }
    }

    private List<ColumnInfo> buildTableColumnsFromReturnType(TypeElement returnType, ProcessingEnvironment processingEnv, TableProps_AutoValue props) {
        return TypeCompileUtils.compileTypeFields(returnType, processingEnv, props, ColumnInfo::new, (field, tableColumn) -> {
            TableField tableField = field.getAnnotation(TableField.class);
            if (field.getAnnotation(SortableColumn.class) != null || (tableField != null && tableField.sortable())) {
                tableColumn.setSortable(true);
            }
            if (field.getAnnotation(CopyableColumn.class) != null || (tableField != null && tableField.copyable())) {
                tableColumn.setCopyable(true);
            }
            if (tableField != null) {
                tableColumn.setDisplay(tableField.display());
            }
        });
    }
}
