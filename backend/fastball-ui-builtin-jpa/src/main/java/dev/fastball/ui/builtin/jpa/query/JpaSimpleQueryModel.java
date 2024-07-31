package dev.fastball.ui.builtin.jpa.query;

import dev.fastball.core.querymodel.QType;
import dev.fastball.ui.components.table.param.SearchParam;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

/**
 * @author Xyf
 */
@Getter
@Setter
public abstract class JpaSimpleQueryModel<T> {
    private SearchParam searchParam;

    public Specification<T> condition() {
        return this::toPredicate;
    }

    public Pageable pageable() {
        if (!searchParam.page()) {
            return Pageable.unpaged();
        }
        return PageRequest.of(searchParam.getCurrent().intValue(), searchParam.getPageSize().intValue());
    }

    protected abstract Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder);

    protected PredicateFn predicateFn() {
        return (type, fieldName, root, query, criteriaBuilder) -> {
            if (type.getOperator() == null) {
                return null;
            }
            Predicate predicate = null;
            switch (type.getOperator()) {
                case EQ:
                    predicate = criteriaBuilder.equal(root.get(fieldName), type.getValue());
                    break;
                case LIKE:
                    predicate = criteriaBuilder.like(root.get(fieldName),
                            "%" + (type.getValue() == null ? "" : type.getValue()) + "%");
                    break;
                // TODO
            }
            return predicate;
        };
    }

    @FunctionalInterface
    public interface PredicateFn {
        Predicate get(QType<?> type, String fieldName, Root<?> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder);
    }
}
