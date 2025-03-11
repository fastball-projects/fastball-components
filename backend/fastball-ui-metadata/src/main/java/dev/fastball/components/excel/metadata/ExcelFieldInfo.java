package dev.fastball.components.excel.metadata;

import dev.fastball.meta.basic.FieldInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ExcelFieldInfo extends FieldInfo {
    private boolean ignore;
    private String templateTips;
    private String headerTips;
}
