package dev.fastball.ui.components.form;

import dev.fastball.auto.value.annotation.AutoValue;
import dev.fastball.core.info.action.ActionInfo;
import dev.fastball.core.info.basic.FieldInfo;
import dev.fastball.core.info.basic.PopupType;
import dev.fastball.core.info.component.ComponentProps;

import java.util.List;

/**
 * @author gr@fastball.dev
 * @since 2022/12/14
 */
@AutoValue
public interface FormProps extends ComponentProps {
    String headerTitle();

    boolean variableForm();

    Boolean showReset();

    PopupType popupType();

    List<FieldInfo> fields();

    List<ActionInfo> actions();
}
