import type { FC, Component, Ref, MutableRefObject } from 'react'

type ReactComponent<P> = Component<P> | FC<P>

export type BasicComponentProps = {
    componentKey: string
    __designMode?: string
    onDataLoad?: Function<Record>
    input?: any
    container?: Container
}

export type PopupComponentProps = {
    setActions?: Function
    closePopup?: Function
}

export type PrintableComponentState = {
    isPrinting: boolean
}

export type MockDataComponent<P> = {
    mockInterceptor?: Function<P>
} & ReactComponent<P>

export type MultiDataComponent = {
    query?: any
    onRecordClick?: Function<Record>
}