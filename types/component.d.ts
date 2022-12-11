import type { FC, Component } from 'react'

type ReactComponent<P> = Component<P> | FC<P>

export type LowcodeComponentProps = {
    __designMode?: string
}

export type MockDataComponent<P> = {
    mockInterceptor?: Function<P>
} & ReactComponent<P>

