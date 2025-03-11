package dev.fastball.components.compiler.excel;

import com.google.auto.service.AutoService;
import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.compile.exception.CompilerException;
import dev.fastball.compile.utils.TypeCompileUtils;
import dev.fastball.meta.basic.DisplayType;
import dev.fastball.meta.utils.JsonUtils;
import dev.fastball.components.excel.ExcelImporter;
import dev.fastball.components.excel.config.ExcelImportConfig;
import dev.fastball.components.excel.config.ExcelImportField;
import dev.fastball.components.excel.metadata.ExcelFieldInfo;
import dev.fastball.components.excel.metadata.ExcelImportMetadata;
import dev.fastball.components.excel.metadata.ExcelImporterProps_AutoValue;

import javax.lang.model.element.TypeElement;
import javax.lang.model.element.VariableElement;
import javax.tools.FileObject;
import javax.tools.StandardLocation;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

import static dev.fastball.components.FastballWebComponentConstants.Excel.*;
import static dev.fastball.components.FastballWebComponentConstants.FASTBALL_WEB_RESOURCE_PREFIX;


@AutoService(value = ComponentCompiler.class)
public class ExcelImporterCompiler extends AbstractComponentCompiler<ExcelImporter<?>, ExcelImporterProps_AutoValue> {
    private static final String COMPONENT_TYPE = "FastballExcelImporter";

    @Override
    protected ExcelImporterProps_AutoValue buildProps(CompileContext compileContext) {
        return new ExcelImporterProps_AutoValue();
    }

    @Override
    protected void compileProps(ExcelImporterProps_AutoValue props, CompileContext compileContext) {
        ExcelImportConfig importConfig = compileContext.getComponentElement().getAnnotation(ExcelImportConfig.class);
        List<TypeElement> genericTypes = getGenericTypeElements(compileContext);
        List<ExcelFieldInfo> fields = (TypeCompileUtils.compileTypeFields(genericTypes.get(0), compileContext.getProcessingEnv(), props, ExcelFieldInfo::new, this::afterFieldBuild));
        List<ExcelFieldInfo> importFields = fields.stream().filter(field -> !field.isIgnore() && field.getValueType() != null && field.getDisplay() == DisplayType.Show).toList();

        ExcelImportMetadata metadata;
        if (importConfig == null) {
            metadata = new ExcelImportMetadata(DEFAULT_TIPS, DEFAULT_SHEET_NAME, DEFAULT_INITIAL_ROW_COUNT, importFields);
        } else {
            metadata = new ExcelImportMetadata(importConfig.tips(), importConfig.sheetName(), importConfig.initialRowCount(), importFields);
        }
        String viewFilePath = compileContext.getComponentElement().getQualifiedName().toString().replaceAll("\\.", "/");
        String relativeName = FASTBALL_WEB_RESOURCE_PREFIX + viewFilePath + RECORD_TYPE_META_FILE_SUFFIX;
        try {
            FileObject file = compileContext.getProcessingEnv().getFiler().createResource(StandardLocation.CLASS_OUTPUT, "", relativeName);
            try (OutputStream out = file.openOutputStream()) {
                JsonUtils.writeJson(out, metadata);
            }
        } catch (IOException e) {
            throw new CompilerException(e);
        }
    }


    private void afterFieldBuild(VariableElement variableElement, ExcelFieldInfo fieldInfo) {
        ExcelImportField importField = variableElement.getAnnotation(ExcelImportField.class);
        if (importField != null) {
            fieldInfo.setIgnore(importField.ignore());
            fieldInfo.setTemplateTips(importField.templateTips());
            fieldInfo.setHeaderTips(importField.headerTips());
        }
    }

    @Override
    public String getComponentName() {
        return COMPONENT_TYPE;
    }
}
