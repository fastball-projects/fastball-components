package dev.fastball.ui.components.tree;


import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.utils.ElementCompileUtils;
import dev.fastball.core.annotation.Action;
import dev.fastball.core.annotation.RecordAction;
import dev.fastball.core.info.action.ActionInfo;
import dev.fastball.core.info.action.RefreshApiActionInfo_AutoValue;
import dev.fastball.core.info.action.RefreshPopupActionInfo_AutoValue;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
public class TreeCompiler extends AbstractComponentCompiler<Tree<?, ?>, TreeProps> {

    private static final String COMPONENT_TYPE = "FastballTree";

    @Override
    protected TreeProps compileProps(CompileContext compileContext) {
        TreeProps_AutoValue props = new TreeProps_AutoValue();
        TreeConfig config = compileContext.getComponentElement().getAnnotation(TreeConfig.class);
        TreeProps.TreeFieldNames fieldNames = TreeProps.TreeFieldNames.DEFAULT;
        if (config != null) {
            fieldNames = new TreeProps.TreeFieldNames(config.keyField(), config.titleField(), config.childrenField());
            compileRecordActions(compileContext, props);
        }
        props.fieldNames(fieldNames);
        return props;
    }

    @Override
    public String getComponentName() {
        return COMPONENT_TYPE;
    }

    private void compileRecordActions(CompileContext compileContext, TreeProps_AutoValue props) {
        List<ActionInfo> recordActions = ElementCompileUtils
                .getMethods(compileContext.getComponentElement(), compileContext.getProcessingEnv()).values().stream()
                .map(method -> {
                    RecordAction actionAnnotation = method.getAnnotation(RecordAction.class);
                    if (actionAnnotation == null) {
                        return null;
                    }
                    RefreshApiActionInfo_AutoValue actionInfo = new RefreshApiActionInfo_AutoValue();
                    actionInfo.actionKey(method.getSimpleName().toString());
                    actionInfo.actionName(actionAnnotation.value());
                    actionInfo.refresh(true);
                    return actionInfo;
                }).filter(Objects::nonNull).collect(Collectors.toList());
        TreeConfig tableConfig = compileContext.getComponentElement().getAnnotation(TreeConfig.class);
        if (tableConfig != null) {
            int index = 1;
            for (Action action : tableConfig.recordActions()) {
                RefreshPopupActionInfo_AutoValue actionInfo = new RefreshPopupActionInfo_AutoValue();
                actionInfo.popupComponent(getReferencedComponentInfo(props, action::component));
                actionInfo.refresh(true);
                actionInfo.popupTitle(action.popupTitle());
                actionInfo.popupType(action.popupType());
                actionInfo.drawerPlacementType(action.drawerPlacementType());
                actionInfo.actionName(action.value());
                actionInfo.actionKey("button" + index++);
                recordActions.add(actionInfo);
            }
        }
        props.recordActions(recordActions);
    }
}
