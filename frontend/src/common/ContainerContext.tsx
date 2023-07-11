import React, { FC, PropsWithChildren, createContext } from 'react';

interface ContainerContextData {
    container: HTMLElement;
}

interface ContainerContextProps extends PropsWithChildren {
    container: HTMLElement;
}

export const ContainerContext = createContext<ContainerContextData | null>(null);

export const ContainerContextProvider: FC<ContainerContextProps> = ({ container, children }) => {

    const contextValue = { container }

    return (
        <ContainerContext.Provider value={contextValue}>
            {children}
        </ContainerContext.Provider>
    );
}