import React, { FC, PropsWithChildren, createContext } from 'react';
import { ReferencedComponent } from '../../types';

export interface FastballContextData {
    container?: HTMLElement;
    getComponent?: (refComponent: ReferencedComponent) => any | undefined;
}

interface FastballContextProps extends FastballContextData, PropsWithChildren {

}

export const FastballContext = createContext<FastballContextData | null>(null);

export const FastballContextProvider: FC<FastballContextProps> = ({ children, container, getComponent }) => {
    const contextValue = { container, getComponent }

    return (
        <FastballContext.Provider value={contextValue}>
            {children}
        </FastballContext.Provider>
    );
}