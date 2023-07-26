package dev.fastball.ui.components.table.param;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SummaryField {

    private int index;
    private int colSpan;
    private Object value;
}
