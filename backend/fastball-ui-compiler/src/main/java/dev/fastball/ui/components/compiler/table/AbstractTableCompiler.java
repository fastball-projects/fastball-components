package dev.fastball.ui.components.compiler.table;


import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.utils.ElementCompileUtils;
import dev.fastball.compile.utils.TypeCompileUtils;
import dev.fastball.core.annotation.RecordAction;
import dev.fastball.core.annotation.ViewAction;
import dev.fastball.core.component.Component;
import dev.fastball.core.component.DownloadFile;
import dev.fastball.meta.action.ActionInfo;
import dev.fastball.meta.action.ApiActionInfo;
import dev.fastball.meta.basic.FieldInfo;
import dev.fastball.ui.components.metadata.table.ColumnInfo;
import dev.fastball.ui.components.metadata.table.TableProps_AutoValue;
import dev.fastball.ui.components.table.config.*;
import dev.fastball.ui.components.table.param.TableSearchParam;
import dev.fastball.ui.components.table.param.TableSize;
import org.springframework.util.StringUtils;

import javax.annotation.processing.ProcessingEnvironment;
import javax.lang.model.element.ExecutableElement;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;
import javax.lang.model.type.TypeMirror;
import java.lang.reflect.Method;
import java.util.*;
import java.util.stream.Collectors;

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
        if (tableConfig != null) {
            TypeMirror rowExpandedComponent = ElementCompileUtils.getTypeMirrorFromAnnotationValue(tableConfig::rowExpandedComponent);
            if (rowExpandedComponent == null || !Component.class.getCanonicalName().equals(rowExpandedComponent.toString())) {
                TypeElement rowExpandedComponentElement = (TypeElement) compileContext.getProcessingEnv().getTypeUtils().asElement(rowExpandedComponent);
                props.rowExpandedComponent(getReferencedComponentInfo(props, rowExpandedComponentElement));
            }

            if (!tableConfig.childrenFieldName().isEmpty()) {
                props.childrenFieldName(tableConfig.childrenFieldName());
            }
            if (tableConfig.size() != TableSize.Default) {
                props.size(tableConfig.size());
            }
            props.keywordSearch(tableConfig.keywordSearch());
            props.recordTriggerType(tableConfig.recordTriggerType());
            props.horizontalScroll(tableConfig.horizontalScroll());
            props.lightQuery(tableConfig.lightQuery());
            props.pageable(tableConfig.pageable());
            props.showRowIndex(tableConfig.showRowIndex());


            // 是否开启导出
            if (tableConfig.exportable()) {
                ApiActionInfo exportActionInfo = ApiActionInfo.builder()
                        .actionKey(EXPORT_METHOD_NAME)
                        .actionName("导出")
                        .downloadFileAction(true)
                        .build();
                props.actions().add(exportActionInfo);
            }
            compileComponentFields(props, tableConfig);

            if(tableConfig.selectionViewActions().length > 0) {
                props.selectionViewActions(Arrays.stream(tableConfig.selectionViewActions())
                        .map(action -> buildViewActionInfo(action, props)).collect(Collectors.toList()));
            }
        } else {
            props.pageable(true);
        }

        List<ActionInfo> actionInfoList = compileContext.getMethodMap().values().stream().map(method -> buildSelectionActionInfo(props.componentKey(), method, compileContext.getProcessingEnv())).filter(Objects::nonNull).collect(Collectors.toList());
        props.selectionActions(actionInfoList);

        props.columns(props.columns().stream().sorted().collect(Collectors.toList()));
        if (props.queryFields() != null && (tableConfig == null || tableConfig.queryable())) {
            props.queryFields(props.queryFields().stream().sorted().collect(Collectors.toList()));
        }
    }

    @Override
    public String getComponentName() {
        return COMPONENT_TYPE;
    }

    protected ActionInfo buildSelectionActionInfo(String componentKey, ExecutableElement method, ProcessingEnvironment processingEnv) {
        SelectionAction actionAnnotation = method.getAnnotation(SelectionAction.class);
        if (actionAnnotation == null) {
            return null;
        }

        ApiActionInfo.ApiActionInfoBuilder builder = ApiActionInfo.builder()
                .componentKey(componentKey)
                .order(actionAnnotation.order())
                .refresh(actionAnnotation.refresh())
                .confirmMessage(actionAnnotation.confirmMessage())
                .closePopupOnSuccess(actionAnnotation.closePopupOnSuccess())
                .actionName(actionAnnotation.name())
                .actionKey(actionAnnotation.key().isEmpty() ? method.getSimpleName().toString() : actionAnnotation.key());
        builder.uploadFileAction(method.getParameters().stream().anyMatch(param -> isUploadField(param.asType(), processingEnv)));
        if (method.getReturnType() != null) {
            TypeElement returnType = (TypeElement) processingEnv.getTypeUtils().asElement(method.getReturnType());
            builder.downloadFileAction(returnType != null && ElementCompileUtils.isAssignableFrom(DownloadFile.class, returnType, processingEnv));
        }
        return builder.build();
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
                if (StringUtils.hasLength(fieldConfig.title())) {
                    field.setTitle(fieldConfig.title());
                }
                field.setWidth(fieldConfig.width());
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
                    if (StringUtils.hasLength(fieldConfig.title())) {
                        field.setTitle(fieldConfig.title());
                    }
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
                tableColumn.setWidth(tableField.width());
                tableColumn.setDisplay(tableField.display());
            }
        });
    }
}
