import React, { FC, useContext } from 'react';

import { ReactComponent, ReferencedComponent } from "../../types";
import { FastballContext } from '../components/FastballContext';

const PreviewComponent: ReactComponent<any> | undefined = window.PreviewComponent || window.parent.PreviewComponent

const ExternalComponent: FC<{ refComponent: ReferencedComponent, componentProps: any }> = ({ refComponent, componentProps }) => {
    const containerContext = useContext(FastballContext)
    const Component = containerContext?.getComponent?.(refComponent)
    if (Component) {
        return <Component {...componentProps} />
    }
    return null
}

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
    } else {
        component = <ExternalComponent refComponent={refComponent} componentProps={props} />
    }
    return component;
}