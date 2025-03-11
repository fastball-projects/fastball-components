package dev.fastball.components.excel.metadata;

import dev.fastball.auto.value.annotation.AutoValue;
import dev.fastball.meta.component.ComponentProps;

/**
 * @author gr@fastball.dev
 * @since 2022/12/14
 */
@AutoValue
public interface ExcelImporterProps extends ComponentProps {

    boolean enableImportHistory();
}