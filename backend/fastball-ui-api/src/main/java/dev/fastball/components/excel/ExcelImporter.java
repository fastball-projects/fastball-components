package dev.fastball.components.excel;

import dev.fastball.components.common.query.SearchParam;
import dev.fastball.components.common.query.TableSearchParam;
import dev.fastball.components.excel.model.ImportHistoryRecord;
import dev.fastball.core.annotation.UIApi;
import dev.fastball.core.component.DataResult;
import dev.fastball.core.component.DownloadFile;
import dev.fastball.components.basic.GenericTypedComponent;
import dev.fastball.components.excel.model.ImportRecord;
import dev.fastball.components.excel.model.RecordImportResult;
import dev.fastball.components.excel.utils.ExcelImportUtils;
import org.apache.poi.util.IOUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.Collection;
import java.util.List;

import static dev.fastball.components.excel.ExcelConstants.CONTENT_TYPE;
import static dev.fastball.components.excel.ExcelConstants.EXCEL_EXTENSION;

public interface ExcelImporter<T> extends GenericTypedComponent<T> {

    String fileName();

    List<RecordImportResult> importRecords(List<ImportRecord<T>> records, ImportHistoryRecord historyRecord);

    void saveResult(ImportHistoryRecord record);

    @UIApi
    DataResult<ImportHistoryRecord> historyRecordList(SearchParam searchParam);

    @UIApi
    default void importData(MultipartFile multipartFile) throws IOException {
        File excelFile = File.createTempFile("fb-excel-import-temp", EXCEL_EXTENSION);
        IOUtils.copy(multipartFile.getInputStream(), excelFile);
        ImportHistoryRecord historyRecord = ExcelImportUtils.buildHistoryRecord(excelFile, multipartFile.getOriginalFilename());
        List<ImportRecord<T>> records = convertData(excelFile);
        historyRecord.setTotalCount(records.size());
        ExcelImportUtils.executeImport(() -> {
            List<RecordImportResult> results;
            if (mustAllValidateToImport() && records.stream().anyMatch(record -> !record.isValid())) {
                results = records.stream().map(record -> RecordImportResult.fail(record.getMessages())).toList();
            } else {
                results = importRecords(records, historyRecord);
            }
            ExcelImportUtils.handleImportResult(getClass(), excelFile, multipartFile.getName(), results, historyRecord);
            saveResult(historyRecord);
            excelFile.delete();
        });
    }

    @UIApi
    default DownloadFile buildExcelTemplate() {
        ByteArrayInputStream inputStream = ExcelImportUtils.buildTemplate(getClass());
        return DownloadFile.builder().inputStream(inputStream).contentType(CONTENT_TYPE).fileName(fileName()).build();
    }

    default List<ImportRecord<T>> convertData(File excelFile) {
        return ExcelImportUtils.convertRecords(getClass(), getActualType(0), excelFile);
    }

    default boolean mustAllValidateToImport() {
        return false;
    }

    @Override
    default Class<?> getSelfClass() {
        return ExcelImporter.class;
    }
}
