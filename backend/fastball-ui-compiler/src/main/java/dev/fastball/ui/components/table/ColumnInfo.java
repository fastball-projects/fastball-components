package dev.fastball.ui.components.table;

import dev.fastball.core.info.basic.FieldInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ColumnInfo extends FieldInfo {
    private boolean sortable;

    private boolean copyable;
}
