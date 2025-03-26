package dev.fastball.components.excel.utils;

import dev.fastball.components.excel.ExcelService;
import dev.fastball.components.excel.model.ImportHistoryRecord;
import dev.fastball.components.excel.model.ImportRecord;
import dev.fastball.components.excel.model.RecordImportResult;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.util.List;

public class ExcelImportUtils {

    private static ExcelService service;

    public static ByteArrayInputStream buildTemplate(Class<?> clazz) {
        return service.buildTemplate(clazz);
    }

    public static void handleImportResult(Class<?> clazz, File excelFile, String fileName, List<RecordImportResult> results, ImportHistoryRecord historyRecord) {
        service.handleImportResult(clazz, excelFile, fileName, results, historyRecord);
    }

    public static <T> List<ImportRecord<T>> convertRecords(Class<?> clazz, Class<T> dataType, File excelFile) {
        return service.convertRecords(clazz, dataType, excelFile);
    }

    public static void setService(ExcelService service) {
        ExcelImportUtils.service = service;
    }

    public static ImportHistoryRecord buildHistoryRecord(File excelFile, String fileName) {
        return service.buildHistoryRecord(excelFile, fileName);
    }

    public static void executeImport(Runnable task) {
        service.executeImport(task);
    }
}
