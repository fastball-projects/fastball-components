package dev.fastball.ui.components.metadata.form;

import dev.fastball.meta.action.ActionInfo;
import dev.fastball.meta.basic.FieldInfo;
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

    private String subTableCreatorButtonText;

}
