package dev.fastball.ui.components.compiler.tree;


import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.core.component.Component;
import dev.fastball.ui.components.metadata.tree.TreeProps;
import dev.fastball.ui.components.metadata.tree.TreeProps_AutoValue;
import dev.fastball.ui.components.tree.config.TreeConfig;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */

public abstract class AbstractTreeCompiler<T extends Component> extends AbstractComponentCompiler<T, TreeProps_AutoValue> {

    private static final String COMPONENT_TYPE = "FastballTree";

    protected boolean searchable() {
        return false;
    }

    protected boolean asyncTree() {
        return false;
    }

    @Override
    protected TreeProps_AutoValue buildProps(CompileContext compileContext) {
        return new TreeProps_AutoValue();
    }

    @Override
    protected void compileProps(TreeProps_AutoValue props, CompileContext compileContext) {
//        if (asyncTree()) {
//            List<? extends TypeMirror> genericTypes = getGenericTypes(compileContext);
//            TypeElement searchType = (TypeElement) compileContext.getProcessingEnv().getTypeUtils().asElement(genericTypes.get(1));
//            props.searchDataTableFields(TypeCompileUtils.compileTypeFields(searchType, compileContext.getProcessingEnv(), props));
//        }

        TreeConfig config = compileContext.getComponentElement().getAnnotation(TreeConfig.class);
        TreeProps.TreeFieldNames fieldNames = TreeProps.TreeFieldNames.DEFAULT;
        if (config != null) {
            fieldNames = new TreeProps.TreeFieldNames(config.keyField(), config.titleField(), config.childrenField(), config.searchKeyField(), config.searchTitleField());
            props.defaultExpandAll(config.defaultExpandAll());
        }
        props.fieldNames(fieldNames);
        props.searchable(searchable());
        props.asyncTree(asyncTree());
    }

    @Override
    public String getComponentName() {
        return COMPONENT_TYPE;
    }
}
