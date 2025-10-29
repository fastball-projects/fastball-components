package dev.fastball.component.builtin.jpa.query;

import dev.fastball.core.field.Range;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.List;

/**
 * @author GR
 */
@Getter
@Setter
public abstract class JpaQueryModel<T> {

    public Specification<T> condition() {
        return this::toPredicate;
    }

    protected abstract Class<T> modelClass();

    protected abstract Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder);

    protected Predicate equalPredicate(Object value, String fieldName, Root<?> root, CriteriaBuilder criteriaBuilder) {
        return criteriaBuilder.equal(root.get(fieldName), value);
    }

    protected Predicate likePredicate(String value, String fieldName, Root<?> root, CriteriaBuilder criteriaBuilder) {
        return criteriaBuilder.like(root.get(fieldName), "%" + value + "%");
    }

    protected Predicate inPredicate(List<?> value, String fieldName, Root<?> root, CriteriaBuilder criteriaBuilder) {
        return root.get(fieldName).in(value);
    }

    protected <Y extends Comparable<? super Y>> Predicate rangePredicate(Range<Y> value, String fieldName, Root<?> root, CriteriaBuilder criteriaBuilder) {
        Y start = value.getStart();
        Y end = value.getEnd();
        if (start != null && end != null) {
            return criteriaBuilder.between(root.get(fieldName), start, end);
        }
        if (start != null) {
            return criteriaBuilder.greaterThanOrEqualTo(root.get(fieldName), start);
        } else if(end != null) {
            return criteriaBuilder.lessThanOrEqualTo(root.get(fieldName), end);
        } else {
            return null;
        }
    }

}
