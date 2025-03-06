package dev.fastball.ui.components.excel;

import dev.fastball.ui.components.excel.model.ImportRecord;
import dev.fastball.ui.components.excel.model.RecordImportResult;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.util.Collection;
import java.util.List;

public interface ExcelService {

    ByteArrayInputStream buildTemplate(Class<?> clazz);

    ByteArrayInputStream buildImportResultFile(Class<?> clazz, File excelFile, List<RecordImportResult> results);

    <T> Collection<ImportRecord<T>> convertRecords(Class<?> clazz, Class<T> dataType, File excelFile);
}
