package dev.fastball.components.excel;

import com.fasterxml.jackson.core.JsonProcessingException;
import dev.fastball.core.field.FieldValidationMessage;
import dev.fastball.meta.basic.*;
import dev.fastball.meta.utils.JsonUtils;
import dev.fastball.components.excel.model.ImportRecord;
import dev.fastball.components.excel.model.RecordImportResult;
import dev.fastball.components.excel.utils.ExcelImportUtils;
import dev.fastball.components.excel.metadata.ExcelFieldInfo;
import dev.fastball.components.excel.metadata.ExcelImportMetadata;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.core.io.Resource;
import org.springframework.util.StringUtils;

import java.io.*;
import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import static dev.fastball.components.FastballWebComponentConstants.Excel.RECORD_TYPE_META_FILE_SUFFIX;
import static dev.fastball.components.FastballWebComponentConstants.FASTBALL_WEB_RESOURCE_PREFIX;


public class ExcelServiceImpl implements ExcelService, InitializingBean, ApplicationContextAware {

    private final Map<Class<?>, ExcelImportMetadata> metadataMap = new ConcurrentHashMap<>();
    private ApplicationContext context;

    @Override
    public ByteArrayInputStream buildTemplate(Class<?> clazz) {
        ExcelImportMetadata metadata = getMetadata(clazz);
        StringBuilder tips = new StringBuilder(metadata.getTips());
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet(metadata.getSheetName());
        XSSFRow tipsRow = sheet.createRow(0);
        XSSFRow titleRow = sheet.createRow(1);
        XSSFDrawing drawing = sheet.createDrawingPatriarch();
        XSSFRow[] rows = new XSSFRow[metadata.getInitialRowCount()];
        for (int i = 0; i < metadata.getInitialRowCount(); i++) {
            rows[i] = sheet.createRow(i + 2);
        }

        int column = 0;
        Map<String, CellStyle> dateFormatStyleMap = new HashMap<>();
        for (ExcelFieldInfo fieldInfo : metadata.getFields()) {
            sheet.setColumnWidth(column, 256 * 20);
            XSSFCell titleCell = titleRow.createCell(column);
            boolean required = fieldInfo.getValidationRules() != null && fieldInfo.getValidationRules().stream().anyMatch(ValidationRuleInfo::getRequired);
            titleCell.setCellStyle(getTitleStyle(workbook, required));
            if (required) {
                // TODO i18n
                titleCell.setCellValue(fieldInfo.getTitle() + " (必填)");
            } else {
                titleCell.setCellValue(fieldInfo.getTitle());
            }
            if (StringUtils.hasLength(fieldInfo.getHeaderTips())) {
                Comment tipsComment = drawing.createCellComment(new XSSFClientAnchor(0, 0, 0, 0, column, 1, column + 1, 2));
                tipsComment.setString(new XSSFRichTextString(fieldInfo.getTemplateTips()));
                titleCell.setCellComment(tipsComment);
            }
            if (StringUtils.hasLength(fieldInfo.getTemplateTips())) {
                tips.append(fieldInfo.getTitle()).append("：").append(fieldInfo.getTemplateTips()).append("\n");
            }
            int fieldColumn = column;
            buildCells(fieldInfo, sheet, fieldColumn, metadata.getInitialRowCount(), dateFormatStyleMap);
            column++;
        }

        CellRangeAddress region = new CellRangeAddress(0, 0, 0, column);
        sheet.addMergedRegion(region);
        XSSFCellStyle tipsStyle = workbook.createCellStyle();
        tipsStyle.setWrapText(true);
        XSSFCell tipsCell = tipsRow.createCell(0);
        tipsCell.setCellValue(tips.toString());
        tipsCell.setCellStyle(tipsStyle);
        tipsRow.setHeight((short) (400 * (tips.toString().split("\n").length + 1)));
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            workbook.write(outputStream);
            workbook.close();
            return new ByteArrayInputStream(outputStream.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    @Override
    public ByteArrayInputStream buildImportResultFile(Class<?> clazz, File excelFile, List<RecordImportResult> results) {
        ExcelImportMetadata metadata = getMetadata(clazz);
        int fieldSize = metadata.getFields().size();
        try (XSSFWorkbook workbook = new XSSFWorkbook(excelFile)) {
            XSSFCellStyle cellStyle = workbook.createCellStyle();
            cellStyle.setFillForegroundColor(HSSFColor.HSSFColorPredefined.RED.getIndex());
            cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            for (int i = 0; i < results.size(); i++) {
                XSSFSheet sheet = workbook.getSheetAt(0);
                XSSFRow row = sheet.getRow(i + 2);
                XSSFCell cell = row.getCell(fieldSize);
                if (cell == null) {
                    cell = row.createCell(fieldSize);
                }
                RecordImportResult recordImportResult = results.get(i);
                if(recordImportResult == null) {
                    cell.setCellValue("未知错误, 记录导入结果为空");
                    row.setRowStyle(cellStyle);
                } else if (!recordImportResult.isSuccessful()) {
                    String errorMessages = results.get(i).getMessages().stream().map(msg -> String.join("\n", msg.getErrorMessages())).collect(Collectors.joining("\n"));
                    cell.setCellValue(errorMessages);
                    row.setRowStyle(cellStyle);
                }
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            workbook.close();
            return new ByteArrayInputStream(outputStream.toByteArray());
        } catch (IOException | InvalidFormatException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public <T> List<ImportRecord<T>> convertRecords(Class<?> clazz, Class<T> dataType, File excelFile) {
        List<ExcelFieldInfo> fields = getMetadata(clazz).getFields();
        List<ImportRecord<T>> records = new ArrayList<>();
        try (XSSFWorkbook workbook = new XSSFWorkbook(excelFile)) {
            XSSFSheet sheet = workbook.getSheetAt(0);
            // TODO 这代码简直了....来不及了, 先这么写吧
            for (int i = 2; i <= sheet.getLastRowNum(); i++) {
                XSSFRow row = sheet.getRow(i);
                Map<String, Object> record = new HashMap<>();
                for (int j = 0; j < fields.size(); j++) {
                    XSSFCell cell = row.getCell(j);
                    ExcelFieldInfo fieldInfo = fields.get(j);
                    if (cell != null) {
                        Map<String, Object> data = record;
                        for (int k = 0; k < fieldInfo.getDataIndex().size(); k++) {
                            String fieldName = fieldInfo.getDataIndex().get(k);
                            if (k == fieldInfo.getDataIndex().size() - 1) {
                                data.put(fieldName, getCellValue(fieldInfo, cell));
                            } else {
                                if (data.containsKey(fieldName)) {
                                    data = (Map<String, Object>) data.get(fieldName);
                                } else {
                                    Map<String, Object> newData = new HashMap<>();
                                    data.put(fieldName, newData);
                                    data = newData;
                                }
                            }
                        }
                    }
                }
                String json = JsonUtils.toJson(record);
                T typeRecord = JsonUtils.fromJson(json, dataType);
                records.add(ImportRecord.valid(typeRecord));
            }
        } catch (InvalidFormatException | IOException e) {
            records.add(ImportRecord.invalid(null, List.of(new FieldValidationMessage("", "文件解析失败"))));
        }
        return records;
    }

    @Override
    public void afterPropertiesSet() {
        ExcelImportUtils.setService(this);
    }


    // FIXME 这样会有很多重复损耗, 后面优化吧
    private Object getCellValue(ExcelFieldInfo fieldInfo, XSSFCell cell) {
        if (cell == null) {
            return null;
        }
        cell.getRawValue();
        String valueType = fieldInfo.getValueType();
        try {
            if (valueType.equals(ValueType.DIGIT.getType()) || valueType.equals(ValueType.MONEY.getType())) {
                if (cell.getCellType() == CellType.NUMERIC) {
                    return BigDecimal.valueOf(cell.getNumericCellValue());
                }
                return new BigDecimal(cell.getStringCellValue());
            } else if (valueType.equals(ValueType.DATE.getType()) || valueType.equals(ValueType.DATE_TIME.getType())) {
                return cell.getDateCellValue();
            } else if (valueType.equals(ValueType.BOOLEAN.getType())) {
                BooleanDisplayInfo booleanDisplayInfo = JsonUtils.fromJson(JsonUtils.toJson(fieldInfo.getFieldProps()), BooleanDisplayInfo.class);
                if (booleanDisplayInfo.getCheckedChildren().equals(cell.getStringCellValue())) {
                    return true;
                }
                return false;
            } else if (valueType.equals(ValueType.SELECT.getType())) {
                Map<String, String> enumMap = getStringStringMap(fieldInfo);
                return enumMap.get(cell.getStringCellValue());
            }
        } catch (Throwable e) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            return BigDecimal.valueOf(cell.getNumericCellValue());
        } else if (cell.getCellType() == CellType.BOOLEAN) {
            return cell.getBooleanCellValue();
        } else if (cell.getCellType() == CellType.STRING) {
            return cell.getStringCellValue();
        } else if (cell.getCellType() == CellType.FORMULA) {
            return cell.getStringCellValue();
        }
        return null;
    }

    private static Map<String, String> getStringStringMap(ExcelFieldInfo fieldInfo) {
        Map<String, EnumItem> valueEnum = fieldInfo.getValueEnum();
        Map<String, String> enumMap = new HashMap<>();
        valueEnum.forEach((value, item) -> {
            if (enumMap.containsKey(item.getText())) {
                throw new IllegalStateException("Enum field [" + String.join(".", fieldInfo.getDataIndex()) + "] having duplicate enum label [" + item.getText() + "]");
            }
            enumMap.put(item.getText(), value);
        });
        return enumMap;
    }

    private void buildCells(ExcelFieldInfo fieldInfo, XSSFSheet sheet, int column, int initialRowCount, Map<String, CellStyle> dateFormatStyleMap) {
        String valueType = fieldInfo.getValueType();
        if (valueType.equals(ValueType.TEXT.getType()) || valueType.equals(ValueType.TEXTAREA.getType())) {
            sheet.setDefaultColumnStyle(column, getDateFormatStyle(sheet, "@", dateFormatStyleMap));
        } else if (valueType.equals(ValueType.DIGIT.getType()) || valueType.equals(ValueType.MONEY.getType())) {
            sheet.setDefaultColumnStyle(column, getDateFormatStyle(sheet, "0.00", dateFormatStyleMap));
        } else if (valueType.equals(ValueType.DATE.getType())) {
            sheet.setDefaultColumnStyle(column, getDateFormatStyle(sheet, "yyyy/m/d h:mm", dateFormatStyleMap));
        } else if (valueType.equals(ValueType.DATE_TIME.getType())) {
            sheet.setDefaultColumnStyle(column, getDateFormatStyle(sheet, "yyyy/m/d", dateFormatStyleMap));
        } else if (valueType.equals(ValueType.TIME.getType())) {
            sheet.setDefaultColumnStyle(column, getDateFormatStyle(sheet, "h:mm:ss", dateFormatStyleMap));
        } else if (valueType.equals(ValueType.BOOLEAN.getType())) {
            try {
                BooleanDisplayInfo booleanDisplayInfo = JsonUtils.fromJson(JsonUtils.toJson(fieldInfo.getFieldProps()), BooleanDisplayInfo.class);
                List<String> enumItems = List.of(booleanDisplayInfo.getCheckedChildren(), booleanDisplayInfo.getUnCheckedChildren());
                buildEnumValidation(fieldInfo, sheet, column, initialRowCount, enumItems);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        } else if (valueType.equals(ValueType.SELECT.getType())) {
            Map<String, String> enumMap = getStringStringMap(fieldInfo);
            buildEnumValidation(fieldInfo, sheet, column, initialRowCount, enumMap.keySet().stream().toList());
        }
    }

    private CellStyle getDateFormatStyle(XSSFSheet sheet, String format, Map<String, CellStyle> dateFormatStyleMap) {
        if (dateFormatStyleMap.containsKey(format)) {
            return dateFormatStyleMap.get(format);
        }
        Workbook workbook = sheet.getWorkbook();
        DataFormat dataFormat = workbook.createDataFormat();
        CellStyle style = workbook.createCellStyle();
        style.setDataFormat(dataFormat.getFormat(format));
        return style;
    }

    private static CellStyle getTitleStyle(XSSFWorkbook wb, boolean required) {
        XSSFCellStyle cellStyle = wb.createCellStyle();
        if (required) {
            cellStyle.setFillForegroundColor(HSSFColor.HSSFColorPredefined.RED.getIndex());
        } else {
            cellStyle.setFillForegroundColor(HSSFColor.HSSFColorPredefined.GREY_50_PERCENT.getIndex());
        }
        cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        XSSFFont font = wb.createFont();
        font.setColor(HSSFColor.HSSFColorPredefined.WHITE.getIndex());
        cellStyle.setFont(font);
        return cellStyle;
    }

    private void buildEnumValidation(ExcelFieldInfo fieldInfo, XSSFSheet sheet, int column, int initialRowCount, List<String> enumItems) {
        XSSFWorkbook workbook = sheet.getWorkbook();
        String sheetName = String.join("_", fieldInfo.getDataIndex());
        XSSFSheet hideSheet = workbook.createSheet(sheetName);
        for (int i = 0; i < enumItems.size(); i++) {
            hideSheet.createRow(i).createCell(0).setCellValue(enumItems.get(i));
        }
        // 创建名称，可被其他单元格引用
        XSSFName categoryName = workbook.createName();
        categoryName.setNameName(sheetName);
        categoryName.setRefersToFormula(sheetName + "!" + "$A$1:$A$" + enumItems.size());
        DataValidationHelper helper = sheet.getDataValidationHelper();
        DataValidationConstraint constraint = helper.createFormulaListConstraint(sheetName);
        CellRangeAddressList addressList = new CellRangeAddressList(2, initialRowCount + 2, column, column);
        DataValidation dataValidation = helper.createValidation(constraint, addressList);
        if (dataValidation instanceof XSSFDataValidation) {
            dataValidation.setSuppressDropDownArrow(true);
            dataValidation.setShowErrorBox(true);
        } else {
            dataValidation.setSuppressDropDownArrow(false);
        }
        sheet.addValidationData(dataValidation);
        workbook.setSheetHidden(workbook.getSheetIndex(hideSheet), true);
    }

    private ExcelImportMetadata getMetadata(Class<?> clazz) {
        if (metadataMap.containsKey(clazz)) {
            return metadataMap.get(clazz);
        }
        String viewFilePath = clazz.getCanonicalName().replaceAll("\\.", "/");
        String relativeName = "classpath:/" + FASTBALL_WEB_RESOURCE_PREFIX + viewFilePath + RECORD_TYPE_META_FILE_SUFFIX;
        Resource metadataResource;
        try {
            Resource[] resources = context.getResources(relativeName);
            if (resources.length == 1) {
                metadataResource = resources[0];
            } else {
                throw new IllegalArgumentException("Excel metadata file not found");
            }
        } catch (IOException e) {
            throw new IllegalArgumentException("Excel metadata file not found", e);
        }
        if (!metadataResource.exists() || !metadataResource.isFile() || !metadataResource.isReadable()) {
            throw new IllegalArgumentException("Excel metadata file not found");
        }
        try (InputStream inputStream = metadataResource.getInputStream()) {
            ExcelImportMetadata metadata = JsonUtils.fromJson(inputStream, ExcelImportMetadata.class);
            metadataMap.put(clazz, metadata);
            return metadata;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.context = applicationContext;
    }
}
