package dev.fastball.components.excel;

import dev.fastball.components.excel.model.ImportHistoryRecord;
import dev.fastball.components.excel.model.ImportRecord;
import dev.fastball.components.excel.model.RecordImportResult;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.util.List;

public interface ExcelService {

    ByteArrayInputStream buildTemplate(Class<?> clazz);

    void handleImportResult(Class<?> clazz, File excelFile, String fileName, List<RecordImportResult> results, ImportHistoryRecord historyRecord);

    <T> List<ImportRecord<T>> convertRecords(Class<?> clazz, Class<T> dataType, File excelFile);

    ImportHistoryRecord buildHistoryRecord(File excelFile, String fileName);

    void executeImport(Runnable task);
}
