package dev.fastball.ui.components.metadata.tableform;

import dev.fastball.core.info.basic.FieldInfo;
import dev.fastball.ui.components.metadata.form.FieldDependencyInfo;
import dev.fastball.ui.components.form.config.ConditionComposeType;
import dev.fastball.ui.components.form.config.FieldDependencyType;
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

    private List<FieldDependencyInfo> fieldDependencyInfoList;

    private ConditionComposeType conditionComposeType;

    private FieldDependencyType fieldDependencyType;
}
