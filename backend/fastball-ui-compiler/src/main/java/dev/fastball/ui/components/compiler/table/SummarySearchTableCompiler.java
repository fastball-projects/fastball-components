package dev.fastball.ui.components.compiler.table;


import com.google.auto.service.AutoService;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.ui.components.table.SummarySearchTable;

/**
 * @author gr@fastball.dev
 * @since 2022/12/30
 */
@AutoService(value = ComponentCompiler.class)
public class SummarySearchTableCompiler extends AbstractSearchTableCompiler<SummarySearchTable<?, ?>> {
}
