package dev.fastball.ui.components.layout.compiler;

import com.google.auto.service.AutoService;
import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.compile.exception.CompilerException;
import dev.fastball.ui.components.layout.*;
import dev.fastball.ui.components.layout.config.GridLayout;
import dev.fastball.ui.components.layout.config.LeftAndRight;
import dev.fastball.ui.components.layout.config.LeftAndTopBottom;
import dev.fastball.ui.components.layout.config.TopAndBottom;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static dev.fastball.compile.utils.ElementCompileUtils.getReferencedComponentInfo;

/**
 * @author gr@fastball.dev
 * @since 2022/12/19
 */
@AutoService(value = ComponentCompiler.class)
public class LayoutCompiler extends AbstractComponentCompiler<LayoutComponent, LayoutProps> {
    private static final String COMPONENT_TYPE = "FastballLayout";

    @Override
    protected LayoutProps buildProps(CompileContext compileContext) {
        LeftAndRight leftAndRight = compileContext.getComponentElement().getAnnotation(LeftAndRight.class);
        if (leftAndRight != null) {
            LeftAndRightLayoutProps_AutoValue props = new LeftAndRightLayoutProps_AutoValue();
            props.left(getReferencedComponentInfo(props, leftAndRight::left));
            props.right(getReferencedComponentInfo(props, leftAndRight::right));
            return props;
        }
        TopAndBottom topAndBottom = compileContext.getComponentElement().getAnnotation(TopAndBottom.class);
        if (topAndBottom != null) {
            TopAndBottomLayoutProps_AutoValue props = new TopAndBottomLayoutProps_AutoValue();
            props.top(getReferencedComponentInfo(props, topAndBottom::top));
            props.bottom(getReferencedComponentInfo(props, topAndBottom::bottom));
            return props;
        }
        LeftAndTopBottom leftAndTopBottom = compileContext.getComponentElement().getAnnotation(LeftAndTopBottom.class);
        if (leftAndTopBottom != null) {
            LeftAndTopBottomLayoutProps_AutoValue props = new LeftAndTopBottomLayoutProps_AutoValue();
            props.left(getReferencedComponentInfo(props, leftAndTopBottom::left));
            props.top(getReferencedComponentInfo(props, leftAndTopBottom::top));
            props.bottom(getReferencedComponentInfo(props, leftAndTopBottom::bottom));
            return props;
        }
        GridLayout gridLayout = compileContext.getComponentElement().getAnnotation(GridLayout.class);
        if (gridLayout != null) {
            GridLayoutProps_AutoValue props = new GridLayoutProps_AutoValue();
            List<GridCellProps_AutoValue> cells = Arrays.stream(gridLayout.cells()).map(cell -> {
                GridCellProps_AutoValue cellProps = new GridCellProps_AutoValue();
                cellProps.x(cell.x());
                cellProps.y(cell.y());
                cellProps.width(cell.width());
                cellProps.height(cell.height());
                cellProps.component(getReferencedComponentInfo(props, cell::component));
                return cellProps;
            }).collect(Collectors.toList());
            props.cells(cells);
            props.cols(gridLayout.cols());
            props.rowHeight(gridLayout.rowHeight());
            props.resizable(gridLayout.resizable());
            props.draggable(gridLayout.draggable());
            return props;
        }
        String message = String.format("LayoutComponent [%s] must add annotation @LeftAndRight, @TopAndBottom, @LeftAndTopBottom or @GridLayout", compileContext.getComponentElement().getQualifiedName());
        throw new CompilerException(message);
    }

    @Override
    public String getComponentName() {
        return COMPONENT_TYPE;
    }
}
