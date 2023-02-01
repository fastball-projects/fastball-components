import * as React from 'react';

import { ReactComponent, ReferencedComponent } from "../../types";

const PreviewComponent: ReactComponent<any> | undefined = window.PreviewComponent || window.parent.PreviewComponent

export const loadRefComponent = (refComponent: ReferencedComponent, props?: Record<string, any>) => {
    let component = null;
    if (!props) {
        props = {};
    }
    if (PreviewComponent) {
        component = <PreviewComponent componentClassName={refComponent.componentClass} {...props} />
    } else if (refComponent.component) {
        const PopupComponent = refComponent.component;
        component = <PopupComponent {...props} />
    }
    return component;
}