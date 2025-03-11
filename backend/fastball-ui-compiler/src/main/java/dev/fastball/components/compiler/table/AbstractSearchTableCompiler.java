package dev.fastball.components.compiler.table;

import dev.fastball.core.component.Component;

/**
 * @author gr@fastball.dev
 * @since 2023/1/10
 */
public abstract class AbstractSearchTableCompiler<T extends Component> extends AbstractTableCompiler<T> {
    @Override
    protected boolean searchable() {
        return true;
    }
}
