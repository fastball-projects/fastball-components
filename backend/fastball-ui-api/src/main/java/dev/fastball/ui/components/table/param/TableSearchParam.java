package dev.fastball.ui.components.table.param;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

/**
 * @author gr@fastball.dev
 * @since 2023/1/24
 */
@Getter
@Setter
public class TableSearchParam<S> implements KeywordSearch, PageableSearch, SortableSearch {
    private String keyword;
    private Long pageSize;
    private Long current;
    private Map<String, SortOrder> sortFields;
    private S search;
}
