package dev.fastball.ui.components.table.param;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * @author gr@fastball.dev
 * @since 2023/1/30
 */
public enum TableSize {
    Small("small"),
    Middle("middle"),
    Large("large");

    @JsonValue
    private final String value;

    TableSize(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
