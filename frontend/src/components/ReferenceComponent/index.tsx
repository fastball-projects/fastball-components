import React from 'react';
import { ReactComponent, ReferenceComponentProps } from '../../../types';
import { loadRefComponent } from '../../common';

const PreviewComponent: ReactComponent<any> | undefined = window.PreviewComponent || window.parent.PreviewComponent

const ReferenceComponent: React.FC<ReferenceComponentProps> = ({ component, __designMode, ...props }) => {
    if (__designMode === 'design' || PreviewComponent) {
        return (
            <>
                <div>ReferenceComponent preview, because can't dynamic import, just print component info:</div>
                <div>NPM package: {component.componentPackage}/{component.componentPath}</div>
                <div>Component class: {component.componentClass}</div>
            </>
        )
    }
    return loadRefComponent(component, { __designMode, ...props });
}

export default ReferenceComponent;