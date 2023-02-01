package dev.fastball.ui.components.tree.compiler;


import com.google.auto.service.AutoService;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.ui.components.tree.Tree;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
@AutoService(value = ComponentCompiler.class)
public class TreeCompiler extends AbstractTreeCompiler<Tree<?>> {
}
