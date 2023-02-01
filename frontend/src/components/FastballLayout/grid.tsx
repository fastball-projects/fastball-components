import React from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import { GridLayoutProps } from "../../../types";
import { loadRefComponent } from "../../common";

const ReactGridLayout = WidthProvider(RGL);

const GridLayout: React.FC<GridLayoutProps> = ({ cells, cols, rowHeight, resizable: isResizable, draggable: isDraggable, __designMode, input, ...props }) => {
    const layout = cells.map(({ x, y, width, height }, index) => ({
        x,
        y,
        w: width,
        h: height,
        i: index.toString()
    }))

    let doms = cells.map(({ component }, index) => <div key={index.toString()}>{loadRefComponent(component, { __designMode, input })}</div>)

    const gridProps = {
        layout,
        isResizable,
        isDraggable,
        cols,
        rowHeight
    }

    return (
        <ReactGridLayout {...gridProps} {...props}>{doms}</ReactGridLayout>
    );
}

export default GridLayout;