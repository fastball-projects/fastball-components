package dev.fastball.ui.components.excel.model;

import dev.fastball.core.field.FieldValidationMessage;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RecordImportResult {
    private boolean successful;

    private List<FieldValidationMessage> messages;

    public static RecordImportResult success() {
        RecordImportResult result = new RecordImportResult();
        result.setSuccessful(true);
        return result;
    }

    public static RecordImportResult fail(List<FieldValidationMessage> messages) {
        RecordImportResult result = new RecordImportResult();
        result.setSuccessful(false);
        result.setMessages(messages);
        return result;
    }
}
