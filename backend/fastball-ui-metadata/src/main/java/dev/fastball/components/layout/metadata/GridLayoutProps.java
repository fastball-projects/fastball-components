package dev.fastball.components.layout.metadata;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import dev.fastball.auto.value.annotation.AutoValue;

import java.util.List;

@AutoValue
@JsonDeserialize
interface GridLayoutProps extends LayoutProps {
    LayoutType layoutType = LayoutType.Grid;

    int cols();

    int rowHeight();

    int colMargin();

    int rowMargin();

    boolean resizable();

    boolean draggable();

    List<GridCellProps_AutoValue> cells();
}