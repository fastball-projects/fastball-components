package dev.fastball.components.excel.model;

import dev.fastball.core.field.FieldValidationMessage;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ImportRecord<T> {
    private boolean valid;

    private List<FieldValidationMessage> messages;

    private T data;

    public static <T> ImportRecord<T> valid(T data) {
        ImportRecord<T> record = new ImportRecord<>();
        record.setValid(true);
        record.setData(data);
        return record;
    }

    public static <T> ImportRecord<T> invalid(T data, List<FieldValidationMessage> messages) {
        ImportRecord<T> record = new ImportRecord<>();
        record.setValid(false);
        record.setMessages(messages);
        record.setData(data);
        return record;
    }
}
