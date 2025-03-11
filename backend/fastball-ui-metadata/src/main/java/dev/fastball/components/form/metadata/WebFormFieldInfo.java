package dev.fastball.components.form.metadata;

import dev.fastball.components.form.metadata.FormFieldInfo;
import dev.fastball.meta.action.ActionInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class WebFormFieldInfo extends FormFieldInfo {
    private List<ActionInfo> subTableRecordActions;

    private String subTableCreatorButtonText;
}
