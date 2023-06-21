package dev.fastball.ui.builtin.jpa.query;

import dev.fastball.ui.components.table.param.TableSearchParam;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

public class QueryUtils {

    public static Pageable pageable(TableSearchParam<?> param) {
        return PageRequest.of(param.getCurrent().intValue() - 1, param.getPageSize().intValue());
    }

}
