import React, { useEffect, useRef, useState } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import { GridLayoutProps } from "../../../types";
import { loadRefComponent } from "../../common";

const ReactGridLayout = WidthProvider(RGL);

const GridLayout: React.FC<GridLayoutProps> = ({ cells, cols, colMargin, rowMargin, resizable: isResizable, draggable: isDraggable, __designMode, input, ...props }) => {
    const [rowHeight, setRowHeight] = useState(30); // 默认行高
    const containerRef = useRef(null);


    const updateRowHeight = () => {
        if (containerRef.current) {
          const containerHeight = containerRef.current.parentElement.offsetHeight;
          const newRowHeight = (containerHeight - (rowMargin * 24 - 1)) / 24
          setRowHeight(newRowHeight);
        }
      };
    
      useEffect(() => {
        updateRowHeight();
        window.addEventListener('resize', updateRowHeight);
        return () => window.removeEventListener('resize', updateRowHeight);
      }, []);

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
        rowHeight,
        margin:[colMargin, rowMargin]
    }

    return (
        <div style={{ height: '100%' }} ref={containerRef}>
            <ReactGridLayout {...gridProps} {...props}>{doms}</ReactGridLayout>
        </div>
    );
}

export default GridLayout;