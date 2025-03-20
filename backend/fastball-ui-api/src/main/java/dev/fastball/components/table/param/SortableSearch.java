package dev.fastball.components.table.param;

import dev.fastball.components.common.metadata.sort.SortOrder;

import java.util.Map;

/**
 * @author gr@fastball.dev
 * @since 2023/1/10
 */
public interface SortableSearch {
    Map<String, SortOrder> getSortFields();
}
