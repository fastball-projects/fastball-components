package dev.fastball.ui.components.form;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValueChangeHandlerInfo {

    private String[] watchFields;

    private String handlerKey;
}
