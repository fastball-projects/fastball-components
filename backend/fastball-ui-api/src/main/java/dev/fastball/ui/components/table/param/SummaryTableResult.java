package dev.fastball.ui.components.table.param;

import lombok.Getter;
import lombok.Setter;

import java.util.Collection;
import java.util.Collections;

// FIXME 应该继承 DataResult, 但是 APT 暂时不支持泛型解析...
@Getter
@Setter
public class SummaryTableResult<T> {


    private static final SummaryTableResult<?> _EMPTY = new SummaryTableResult<>();

    private Long total;
    private Collection<T> data;
    private Collection<SummaryField> summaryFields;

    public SummaryTableResult() {
    }

    public SummaryTableResult(Long total, Collection<T> data, Collection<SummaryField> summaryFields) {
        this.total = total;
        this.data = data;
        this.summaryFields = summaryFields;
    }

    public static <T> SummaryTableResult<T> build(Collection<T> data) {
        return build(null, data);
    }

    public static <T> SummaryTableResult<T> build(Collection<T> data, Collection<SummaryField> summaryFields) {
        return build(null, data, summaryFields);
    }

    public static <T> SummaryTableResult<T> build(Long total, Collection<T> data) {
        return new SummaryTableResult<>(total, data, Collections.emptyList());
    }

    public static <T> SummaryTableResult<T> build(Long total, Collection<T> data, Collection<SummaryField> summaryFields) {
        return new SummaryTableResult<>(total, data, summaryFields);
    }

    @SuppressWarnings("unchecked")
    public static <T> SummaryTableResult<T> empty() {
        return (SummaryTableResult<T>) _EMPTY;
    }
}
