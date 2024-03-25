package dev.fastball.ui.components.metadata.tableform;

import dev.fastball.auto.value.annotation.AutoValue;
import dev.fastball.core.info.basic.PopupType;
import dev.fastball.core.info.component.ComponentProps;

import java.util.List;

@AutoValue
public interface TableFormProps extends ComponentProps {
    int column();

    String headerTitle();

    String childrenFieldName();

    boolean variableForm();

    String rowKey();

    boolean rowEditable();

    boolean rowSelectable();

    boolean defaultSelected();

    Boolean showReset();

    PopupType popupType();

    List<TableFormFieldInfo> fields();
}

