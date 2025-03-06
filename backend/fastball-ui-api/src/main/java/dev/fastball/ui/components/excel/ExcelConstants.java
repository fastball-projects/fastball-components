package dev.fastball.ui.components.excel;

public interface ExcelConstants {
    int DEFAULT_INITIAL_ROW_COUNT = 500;
    String RECORD_TYPE_META_FILE_SUFFIX = ".fb-excel.json";
    String DEFAULT_SHEET_NAME = "导入数据";
    String DEFAULT_TIPS = """
填写须知：
不能在本excel表中对空间信息字段进行增加、删除、修改
红色字段为必填字段，灰色字段为选填字段

""";
}
