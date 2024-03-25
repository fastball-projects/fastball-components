package dev.fastball.ui.builtin.jpa.query;

import dev.fastball.orm.jpa.JpaBaseEntity;
import dev.fastball.ui.components.table.param.SortOrder;
import dev.fastball.ui.components.table.param.TableSearchParam;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.stream.Collectors;

public class QueryUtils {

    public static <T> Specification<T> toCondition(TableSearchParam<? extends JpaQueryModel<T>> param) {
        if (param == null || param.getSearch() == null) {
            return null;
        }
        return param.getSearch().condition();
    }

    public static Pageable pageable(TableSearchParam<?> param) {
        if (param == null) {
            return Unpaged.unpaged(Sort.by(Sort.Order.desc("createdAt")));
        }
        Sort sort;
        if (!CollectionUtils.isEmpty(param.getSortFields())) {
            List<Sort.Order> orderList = param.getSortFields().entrySet().stream().map(orderField -> {
                if (SortOrder.Descend == orderField.getValue()) {
                    return Sort.Order.desc(orderField.getKey());
                }
                return Sort.Order.asc(orderField.getKey());
            }).collect(Collectors.toList());
            sort = Sort.by(orderList);
        } else if (param.getSearch() != null && param.getSearch() instanceof JpaQueryModel && JpaBaseEntity.class.isAssignableFrom(((JpaQueryModel<?>) param.getSearch()).modelClass())) {
            sort = Sort.by(Sort.Order.desc("createdAt"));
        } else {
            sort = Sort.unsorted();
        }
        Pageable pageable;
        if (param.page()) {
            pageable = PageRequest.of(param.getCurrent().intValue() - 1, param.getPageSize().intValue(), sort);
        } else {
            pageable = Unpaged.unpaged(sort);
        }
        return pageable;
    }

}
