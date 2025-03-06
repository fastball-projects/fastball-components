package dev.fastball.ui.components.metadata.excel;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExcelImportMetadata {

    private String tips;
    private String sheetName;
    private int initialRowCount;
    private List<ExcelFieldInfo> fields;
}
