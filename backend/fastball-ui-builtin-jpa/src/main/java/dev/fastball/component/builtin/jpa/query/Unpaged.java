package dev.fastball.component.builtin.jpa.query;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class Unpaged implements Pageable {

    private Sort sort;

    private Unpaged(Sort sort) {
        this.sort = sort;
    }

    public static Pageable unpaged() {
        return Pageable.unpaged();
    }

    public static Pageable unpaged(Sort sort) {
        if (sort == null || sort.isUnsorted()) {
            return Pageable.unpaged();
        }
        return new Unpaged(sort);
    }

    @Override
    public Pageable previousOrFirst() {
        return this;
    }

    @Override
    public Pageable next() {
        return this;
    }

    @Override
    public boolean hasPrevious() {
        return false;
    }

    @Override
    public Sort getSort() {
        return sort != null ? sort : Sort.unsorted();
    }

    @Override
    public int getPageSize() {
        return Integer.MAX_VALUE;
    }

    @Override
    public int getPageNumber() {
        return 0;
    }

    @Override
    public long getOffset() {
        return 0;
    }

    @Override
    public Pageable first() {
        return this;
    }

    @Override
    public Pageable withPage(int pageNumber) {
        if (pageNumber == 0) {
            return this;
        } else {
            throw new UnsupportedOperationException();
        }
    }
}
