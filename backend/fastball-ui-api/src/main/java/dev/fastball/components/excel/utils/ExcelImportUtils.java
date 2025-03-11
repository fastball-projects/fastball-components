package dev.fastball.components.excel.utils;

import dev.fastball.components.excel.ExcelService;
import dev.fastball.components.excel.model.ImportRecord;
import dev.fastball.components.excel.model.RecordImportResult;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.util.Collection;
import java.util.List;

public class ExcelImportUtils {

    private static ExcelService service;

    public static ByteArrayInputStream buildTemplate(Class<?> clazz) {
        return service.buildTemplate(clazz);
    }

    public static ByteArrayInputStream buildImportResultFile(Class<?> clazz, File excelFile, List<RecordImportResult> results) {
        return service.buildImportResultFile(clazz, excelFile, results);
    }

    public static <T> List<ImportRecord<T>> convertRecords(Class<?> clazz, Class<T> dataType, File excelFile) {
        return service.convertRecords(clazz, dataType, excelFile);
    }

    public static void setService(ExcelService service) {
        ExcelImportUtils.service = service;
    }
}
