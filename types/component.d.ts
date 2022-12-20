import type { FC, Component, Ref, MutableRefObject } from 'react'

type ReactComponent<P> = Component<P> | FC<P>

export type LowcodeComponentProps = {
    componentKey: string
    __designMode?: string
}

export type MockDataComponent<P> = {
    mockInterceptor?: Function<P>
} & ReactComponent<P>

export type MultiDataComponent = {
    query?: any
    onRecordClick?: Function<Record>
}