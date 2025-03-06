package dev.fastball.ui.components.metadata.form;

import dev.fastball.auto.value.annotation.AutoValue;
import dev.fastball.meta.annotation.PropertyDescription;
import dev.fastball.meta.basic.PopupType;
import dev.fastball.meta.component.ComponentProps;
import dev.fastball.ui.components.form.config.FormLayout;

import java.util.List;

/**
 * @author gr@fastball.dev
 * @since 2022/12/14
 */
@AutoValue
public interface FormProps extends ComponentProps {
    @PropertyDescription("Form column number, default 2")
    int column();

    @PropertyDescription("Form layout, default Vertical")
    FormLayout layout();

    @PropertyDescription("表单标题")
    String headerTitle();

    boolean variableForm();

    @PropertyDescription("Is a read-only form")
    boolean readonly();

    @PropertyDescription("Display Reset Button")
    Boolean showReset();

    PopupType popupType();

    @PropertyDescription("Form Fields")
    List<FormFieldInfo> fields();

    List<ValueChangeHandlerInfo> valueChangeHandlers();
}
