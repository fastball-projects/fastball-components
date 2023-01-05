import * as React from 'react'
import { Modal, Drawer } from 'antd';

import type { PopupProps, ReactComponent } from '../../types'
import { loadRefComponent } from './component'

const FastballPopup: React.FC<PopupProps> = ({ trigger, popupActionInfo, popupTitle, popupType, onClose }) => {
    const [open, setOpen] = React.useState(false);
    const [actions, setActions] = React.useState([]);

    const closePopup = () => {
        setOpen(false);
        if (onClose) {
            onClose();
        }
    }

    const contentComponent = loadRefComponent(popupActionInfo.popupComponent, {
        data: popupActionInfo.data,
        closePopup,
        setActions
    })

    const title = popupTitle || popupActionInfo.popupTitle

    let popupComponent;
    if (popupType === 'Drawer') {
        popupComponent = <Drawer title={title} onClose={closePopup} open={open} footer={actions}>{contentComponent}</Drawer>
    } else {
        popupComponent = <Modal title={title} onCancel={closePopup} open={open} footer={actions}>{contentComponent}</Modal>
    }

    const triggerComponent = <span onClick={() => setOpen(true)}>{trigger || popupActionInfo.actionName || popupActionInfo.actionKey}</span>;

    return (
        <>
            {triggerComponent}
            {popupComponent}
        </>
    )
}

export default FastballPopup;