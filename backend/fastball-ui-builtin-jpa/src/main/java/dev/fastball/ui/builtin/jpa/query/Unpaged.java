package dev.fastball.ui.builtin.jpa.query;

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

    public boolean isPaged() {
        return false;
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
        throw new UnsupportedOperationException();
    }

    @Override
    public int getPageNumber() {
        throw new UnsupportedOperationException();
    }

    @Override
    public long getOffset() {
        throw new UnsupportedOperationException();
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
