package dev.fastball.ui.components.form;

import dev.fastball.core.info.action.ActionInfo;
import dev.fastball.core.info.basic.FieldInfo;
import dev.fastball.ui.components.form.config.ConditionComposeType;
import dev.fastball.ui.components.form.config.FieldDependencyType;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class FormFieldInfo extends FieldInfo {
    private List<FieldDependencyInfo> fieldDependencyInfoList;

    private ConditionComposeType conditionComposeType;

    private FieldDependencyType fieldDependencyType;

    private List<ActionInfo> subTableRecordActions;

}
