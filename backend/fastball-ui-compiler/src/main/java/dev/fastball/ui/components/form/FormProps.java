package dev.fastball.ui.components.form;

import dev.fastball.auto.value.annotation.AutoValue;
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
    int column();

    String headerTitle();

    boolean variableForm();

    boolean readonly();

    Boolean showReset();

    PopupType popupType();

    List<FieldInfo> fields();
}
