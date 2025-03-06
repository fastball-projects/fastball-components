package dev.fastball.ui.components.excel.config;

import dev.fastball.ui.components.excel.ExcelConstants;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ExcelImportConfig {

    String tips() default ExcelConstants.DEFAULT_TIPS;

    String sheetName() default ExcelConstants.DEFAULT_SHEET_NAME;

    int initialRowCount() default 500;
}
