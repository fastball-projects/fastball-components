package dev.fastball.components.compiler.tableform;

import com.google.auto.service.AutoService;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.components.tableform.TableForm;

/**
 * @author gr@fastball.dev
 * @since 2023/1/9
 */
@AutoService(value = ComponentCompiler.class)
public class TableFormCompiler extends AbstractTableFormCompiler<TableForm<?>> {
}
