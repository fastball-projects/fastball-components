package dev.fastball.components.form.metadata;

import dev.fastball.auto.value.annotation.AutoValue;
import dev.fastball.components.form.config.FormLayout;
import dev.fastball.components.form.metadata.FormProps;
import dev.fastball.meta.annotation.PropertyDescription;
import dev.fastball.meta.basic.PopupType;
import dev.fastball.meta.component.ComponentProps;

import java.util.List;

/**
 * @author gr@fastball.dev
 * @since 2022/12/14
 */
@AutoValue
public interface WebFormProps extends FormProps {
    @PropertyDescription("Form column number, default 2")
    int column();

    @PropertyDescription("Display Reset Button")
    Boolean showReset();

    @PropertyDescription("Form Fields")
    List<WebFormFieldInfo> fields();
}
