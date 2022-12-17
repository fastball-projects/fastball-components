import * as React from 'react';
import { ReactComponent, ReferencedComponent } from "../../types";

const PreviewComponent: ReactComponent<any> | undefined = window.PreviewComponent

export const loadRefComponent = (refComponent: ReferencedComponent, props?: Record<string, any>) => {
    let component = null;
    if (PreviewComponent) {
        component = <PreviewComponent componentClassName={refComponent.componentClass} />
    } else if (refComponent.component) {
        const PopupComponent = refComponent.component;
        component = <PopupComponent />
    }
    if (component && props) {
        Object.assign(component.props, props)
    }
    return component;
}