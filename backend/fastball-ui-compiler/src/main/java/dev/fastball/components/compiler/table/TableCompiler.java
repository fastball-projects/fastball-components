package dev.fastball.components.compiler.table;


import com.google.auto.service.AutoService;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.components.table.Table;

/**
 * @author gr@fastball.dev
 * @since 2022/12/30
 */
@AutoService(value = ComponentCompiler.class)
public class TableCompiler extends AbstractTableCompiler<Table<?>> {
}
