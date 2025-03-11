package dev.fastball.components.excel;

import dev.fastball.core.annotation.UIApi;
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

public interface ExcelImporter<T> extends GenericTypedComponent<T> {

    String fileName();

    List<RecordImportResult> importRecords(List<ImportRecord<T>> records);

    @UIApi
    default DownloadFile importData(MultipartFile multipartFile) throws IOException {
        File excelFile = File.createTempFile("fb-excel-import-temp", ".temp");
        IOUtils.copy(multipartFile.getInputStream(), excelFile);
        List<ImportRecord<T>> records = convertData(excelFile);
        List<RecordImportResult> results = importData(records);
        ByteArrayInputStream inputStream = ExcelImportUtils.buildImportResultFile(getClass(), excelFile, results);
        DownloadFile downloadFile = DownloadFile.builder().inputStream(inputStream).contentType(contentType()).fileName(fileName()).build();
        excelFile.delete();
        return downloadFile;
    }

    @UIApi
    default DownloadFile buildExcelTemplate() {
        ByteArrayInputStream inputStream = ExcelImportUtils.buildTemplate(getClass());
        return DownloadFile.builder().inputStream(inputStream).contentType(contentType()).fileName(fileName()).build();
    }

    default List<ImportRecord<T>> convertData(File excelFile) {
        return ExcelImportUtils.convertRecords(getClass(), getActualType(0), excelFile);
    }

    default boolean mustAllValidateToImport() {
        return false;
    }

    default String contentType() {
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }

    default List<RecordImportResult> importData(List<ImportRecord<T>> records) {
        if (mustAllValidateToImport() && records.stream().anyMatch(record -> !record.isValid())) {
            return records.stream().map(record -> RecordImportResult.fail(record.getMessages())). toList();
        }
        return importRecords(records);
    }

    @Override
    default Class<?> getSelfClass() {
        return ExcelImporter.class;
    }
}
