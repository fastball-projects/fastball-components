package dev.fastball.ui.components.compiler.excel;

import com.google.auto.service.AutoService;
import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.compile.exception.CompilerException;
import dev.fastball.compile.utils.TypeCompileUtils;
import dev.fastball.meta.basic.DisplayType;
import dev.fastball.meta.utils.JsonUtils;
import dev.fastball.ui.components.excel.ExcelConstants;
import dev.fastball.ui.components.excel.ExcelImporter;
import dev.fastball.ui.components.excel.config.ExcelImportConfig;
import dev.fastball.ui.components.excel.config.ExcelImportField;
import dev.fastball.ui.components.metadata.excel.ExcelFieldInfo;
import dev.fastball.ui.components.metadata.excel.ExcelImportMetadata;
import dev.fastball.ui.components.metadata.excel.ExcelImporterProps_AutoValue;

import javax.lang.model.element.TypeElement;
import javax.lang.model.element.VariableElement;
import javax.tools.FileObject;
import javax.tools.StandardLocation;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

import static dev.fastball.core.Constants.FASTBALL_RESOURCE_PREFIX;


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
            metadata = new ExcelImportMetadata(ExcelConstants.DEFAULT_TIPS, ExcelConstants.DEFAULT_SHEET_NAME, ExcelConstants.DEFAULT_INITIAL_ROW_COUNT, importFields);
        } else {
            metadata = new ExcelImportMetadata(importConfig.tips(), importConfig.sheetName(), importConfig.initialRowCount(), importFields);
        }
        String viewFilePath = compileContext.getComponentElement().getQualifiedName().toString().replaceAll("\\.", "/");
        String relativeName = FASTBALL_RESOURCE_PREFIX + viewFilePath + ExcelConstants.RECORD_TYPE_META_FILE_SUFFIX;
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
