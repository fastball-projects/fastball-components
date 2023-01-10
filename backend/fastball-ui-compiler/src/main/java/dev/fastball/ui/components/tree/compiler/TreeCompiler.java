package dev.fastball.ui.components.tree.compiler;


import com.google.auto.service.AutoService;
import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.compile.utils.ElementCompileUtils;
import dev.fastball.core.annotation.Action;
import dev.fastball.core.info.action.ActionInfo;
import dev.fastball.core.info.action.PopupActionInfo;
import dev.fastball.ui.components.tree.Tree;
import dev.fastball.ui.components.tree.TreeConfig;
import dev.fastball.ui.components.tree.TreeProps;
import dev.fastball.ui.components.tree.TreeProps_AutoValue;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
@AutoService(value = ComponentCompiler.class)
public class TreeCompiler extends AbstractComponentCompiler<Tree<?, ?>, TreeProps_AutoValue> {

    private static final String COMPONENT_TYPE = "FastballTree";

    @Override
    protected TreeProps_AutoValue buildProps(CompileContext compileContext) {
        return new TreeProps_AutoValue();
    }

    @Override
    protected void compileProps(TreeProps_AutoValue props, CompileContext compileContext) {
        TreeConfig config = compileContext.getComponentElement().getAnnotation(TreeConfig.class);
        TreeProps.TreeFieldNames fieldNames = TreeProps.TreeFieldNames.DEFAULT;
        if (config != null) {
            fieldNames = new TreeProps.TreeFieldNames(config.keyField(), config.titleField(), config.childrenField());
            compileRecordActions(compileContext, props);
            props.defaultExpandAll(config.defaultExpandAll());
        }
        props.fieldNames(fieldNames);
    }

    @Override
    public String getComponentName() {
        return COMPONENT_TYPE;
    }

    private void compileRecordActions(CompileContext compileContext, TreeProps_AutoValue props) {
        List<ActionInfo> recordActions = ElementCompileUtils
                .getMethods(compileContext.getComponentElement(), compileContext.getProcessingEnv()).values().stream()
                .map(this::buildActionInfo).filter(Objects::nonNull).collect(Collectors.toList());
        TreeConfig config = compileContext.getComponentElement().getAnnotation(TreeConfig.class);
        if (config != null) {
            int index = 1;
            for (Action action : config.recordActions()) {
                PopupActionInfo actionInfo = buildPopupActionInfo(action, props, "button" + index++);
                recordActions.add(actionInfo);
            }
        }
        props.recordActions(recordActions);
    }
}
