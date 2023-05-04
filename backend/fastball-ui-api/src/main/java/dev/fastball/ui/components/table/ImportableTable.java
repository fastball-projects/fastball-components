package dev.fastball.ui.components.table;

import dev.fastball.core.annotation.UIApi;

import java.util.Collection;

public interface ImportableTable<T> {

    @UIApi
    default void importData(Collection<T> data) {
    }
}
