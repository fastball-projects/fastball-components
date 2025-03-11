package dev.fastball.components.excel.config;

import dev.fastball.components.FastballWebComponentConstants;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ExcelImportConfig {

    String tips() default FastballWebComponentConstants.Excel.DEFAULT_TIPS;

    String sheetName() default FastballWebComponentConstants.Excel.DEFAULT_SHEET_NAME;

    int initialRowCount() default 500;
}
