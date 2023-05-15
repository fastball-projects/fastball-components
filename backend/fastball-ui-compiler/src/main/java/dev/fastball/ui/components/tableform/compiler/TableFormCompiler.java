package dev.fastball.ui.components.tableform.compiler;

import com.google.auto.service.AutoService;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.ui.components.form.Form;
import dev.fastball.ui.components.form.compiler.AbstractFormCompiler;
import dev.fastball.ui.components.tableform.TableForm;

/**
 * @author gr@fastball.dev
 * @since 2023/1/9
 */
@AutoService(value = ComponentCompiler.class)
public class TableFormCompiler extends AbstractTableFormCompiler<TableForm<?>> {
}
