package dev.fastball.components.compiler.tree;


import com.google.auto.service.AutoService;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.components.tree.AsyncTree;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
@AutoService(value = ComponentCompiler.class)
public class AsyncTreeCompiler extends AbstractTreeCompiler<AsyncTree<?>> {

    @Override
    protected boolean asyncTree() {
        return true;
    }
}
