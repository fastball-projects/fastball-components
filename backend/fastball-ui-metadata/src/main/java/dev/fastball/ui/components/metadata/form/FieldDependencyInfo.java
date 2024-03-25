package dev.fastball.ui.components.metadata.form;

import dev.fastball.ui.components.form.config.FieldDependencyCondition;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FieldDependencyInfo {

    private String field;

    private String value;

    private FieldDependencyCondition condition;
}
