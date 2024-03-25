package dev.fastball.ui.components.compiler.tree;


import com.google.auto.service.AutoService;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.ui.components.tree.VariableSearchTree;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
@AutoService(value = ComponentCompiler.class)
public class VariableSearchTreeCompiler extends AbstractTreeCompiler<VariableSearchTree<?, ?>> {

    @Override
    protected boolean searchable() {
        return true;
    }
}
