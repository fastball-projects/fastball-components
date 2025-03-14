package dev.fastball.components.excel;

import dev.fastball.components.excel.model.ImportRecord;
import dev.fastball.components.excel.model.RecordImportResult;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.util.Collection;
import java.util.List;

public interface ExcelService {

    ByteArrayInputStream buildTemplate(Class<?> clazz);

    ByteArrayInputStream buildImportResultFile(Class<?> clazz, File excelFile, List<RecordImportResult> results);

    <T> List<ImportRecord<T>> convertRecords(Class<?> clazz, Class<T> dataType, File excelFile);
}
