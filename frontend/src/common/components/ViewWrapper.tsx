import React, { FC, ReactPortal } from "react";

export const FastballViewPathKey = 'fb-view-path'

export interface ViewWrapperProps {
    fastballViewPath: any
    children: React.ReactNode
}

const ViewWrapper: FC<ViewWrapperProps> = ({ fastballViewPath, children }) => <div fb-view-path={JSON.stringify(fastballViewPath)}>
    {children}
</div>

export default ViewWrapper;