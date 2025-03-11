package dev.fastball.components.compiler.tree;


import com.google.auto.service.AutoService;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.components.tree.VariableAsyncSearchTree;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
@AutoService(value = ComponentCompiler.class)
public class VariableAsyncSearchTreeCompiler extends AbstractTreeCompiler<VariableAsyncSearchTree<?, ?, ?>> {
    @Override
    protected boolean asyncTree() {
        return true;
    }

    @Override
    protected boolean searchable() {
        return true;
    }
}
