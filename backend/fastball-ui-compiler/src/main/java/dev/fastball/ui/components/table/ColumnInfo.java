package dev.fastball.ui.components.table;

import dev.fastball.auto.value.annotation.AutoValue;
import dev.fastball.core.info.basic.FieldInfo;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
@AutoValue
public interface ColumnInfo extends FieldInfo {
    boolean sortable();

    boolean copyable();
}
