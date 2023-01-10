package dev.fastball.ui.components.table.compiler;


import com.google.auto.service.AutoService;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.ui.components.table.VariableSearchTable;

/**
 * @author gr@fastball.dev
 * @since 2022/12/30
 */
@AutoService(value = ComponentCompiler.class)
public class VariableSearchTableCompiler extends AbstractSearchTableCompiler<VariableSearchTable<?, ?, ?>> {
}
