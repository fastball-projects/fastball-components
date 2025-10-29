package dev.fastball.components.excel.model;

import dev.fastball.core.annotation.Field;
import dev.fastball.core.field.Attachment;
import dev.fastball.meta.basic.DisplayType;
import lombok.Data;

import java.util.Date;


@Data
public class ImportHistoryRecord {
    @Field(title = "导入记录ID", display = DisplayType.Hidden)
    private String id;
    @Field(title = "导入时间")
    private Date importTime;
    @Field(title = "导入总条数")
    private int totalCount;
    @Field(title = "成功总条数")
    private int successCount;
    @Field(title = "失败总条数")
    private int failCount;
    @Field(title = "状态")
    private ImportState state;
    @Field(title = "导入文件")
    private Attachment importFile;
    @Field(title = "导入结果")
    private Attachment resultFile;
}
