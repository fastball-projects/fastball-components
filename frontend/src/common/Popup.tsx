import * as React from 'react'
import { Modal, Drawer, Popover } from 'antd';

import type { PopupProps } from '../../types'
import { loadRefComponent } from './component'

const FastballPopup: React.FC<PopupProps> = ({ trigger, placementType, popupType, popupComponent, title, onClose, width, input }) => {
    const [open, setOpen] = React.useState(false);
    const [actions, setActions] = React.useState([]);

    const closePopup = () => {
        setOpen(false);
        if (onClose) {
            onClose();
        }
    }

    const triggerComponent = <span onClick={() => setOpen(true)}>{trigger}</span>;
    if (popupType === 'Popover') {
        const contentComponent = loadRefComponent(popupComponent, {
            input,
            closePopup
        })
        const onPopoverOpenChange = (visible: boolean) => {
            if (!visible) closePopup()
        }
        return <Popover overlayStyle={{ width }} placement={placementType} title={title} onOpenChange={onPopoverOpenChange} open={open} content={contentComponent}>{triggerComponent}</Popover>
    }

    let popupWrapperComponent;
    const contentComponent = loadRefComponent(popupComponent, {
        input,
        closePopup,
        setActions
    })

    if (popupType === 'Modal') {
        popupWrapperComponent = <Modal title={title} width={width} onCancel={closePopup} open={open} footer={actions}>{contentComponent}</Modal>
    } else if (popupType === 'Drawer') {
        popupWrapperComponent = <Drawer title={title} width={width} onClose={closePopup} open={open} footer={actions} placement={placementType}>{contentComponent}</Drawer>
    }

    return (
        <>
            {triggerComponent}
            {popupWrapperComponent}
        </>
    )
}

export default FastballPopup;