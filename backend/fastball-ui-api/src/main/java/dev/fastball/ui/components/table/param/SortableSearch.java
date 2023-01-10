package dev.fastball.ui.components.table.param;

import java.util.Map;

/**
 * @author gr@fastball.dev
 * @since 2023/1/10
 */
public interface SortableSearch {
    Map<String, SortOrder> sortFields();
}
