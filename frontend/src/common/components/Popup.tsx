import * as React from 'react'
import { Modal, Drawer, Popover } from 'antd';

import type { PopupProps } from '../../../types'
import { loadRefComponent } from '../component'

const FastballPopup: React.FC<PopupProps> = ({ trigger, triggerType, placementType, popupType, popupComponent, title, onClose, width, input, __designMode }) => {
    const [open, setOpen] = React.useState(false);
    const [actions, setActions] = React.useState([]);

    const closePopup = () => {
        setOpen(false);
        if (onClose) {
            onClose();
        }
    }

    let triggerComponent: React.ReactElement;
    if (triggerType === 'Hover') {
        triggerComponent = <span onMouseEnter={() => setOpen(true)} onMouseLeave={() => closePopup()} >{trigger}</span>;
    } else if (triggerType === 'ContextMenu') {
        triggerComponent = <span onContextMenu={(e) => {
            e.preventDefault();
            setOpen(true)
        }}>{trigger}</span>;
    } else {
        triggerComponent = <span onClick={() => setOpen(true)}>{trigger}</span>;
    }
    if (popupType === 'Popover') {
        const contentComponent = loadRefComponent(popupComponent, {
            input,
            closePopup,
            __designMode
        })
        const onPopoverOpenChange = (visible: boolean) => {
            if (!visible) closePopup()
        }
        return <Popover overlayStyle={{ width }} arrowPointAtCenter={true} forceRender={triggerType === 'Hover'} placement={placementType} title={title} onOpenChange={onPopoverOpenChange} open={open} content={contentComponent}>{triggerComponent}</Popover>
    }

    let popupWrapperComponent;
    const contentComponent = loadRefComponent(popupComponent, {
        input,
        closePopup,
        __designMode,
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