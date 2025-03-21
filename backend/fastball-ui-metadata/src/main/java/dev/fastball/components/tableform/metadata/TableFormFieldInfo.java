package dev.fastball.components.tableform.metadata;

import dev.fastball.components.form.config.ConditionComposeType;
import dev.fastball.components.form.config.FieldDependencyType;
import dev.fastball.components.form.metadata.FieldDependencyInfo;
import dev.fastball.meta.basic.FieldInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class TableFormFieldInfo extends FieldInfo {

    private boolean sortable;

    private boolean copyable;

    private boolean hideInTable;

    private boolean hideInForm;

    private boolean editInTable;

    private boolean editInForm;

    private int width;

    private List<FieldDependencyInfo> fieldDependencyInfoList;

    private ConditionComposeType conditionComposeType;

    private FieldDependencyType fieldDependencyType;
}
