import * as React from 'react'
import { Modal, Drawer, Popover, PopoverProps, ModalProps, DrawerProps } from 'antd';

import type { PopupProps, RefComponentInfo } from '../../../types'
import { loadRefComponent } from '../component'
import { getByPaths } from '../utils';

const buildPopupComponent = ({ propsKey, dataPath, componentInfo }: RefComponentInfo, props: Record<string, any>, input?: any) => {
    const popupProps: Record<string, any> = {
        ...props
    }
    if (input) {
        if (dataPath && dataPath.length > 0) {
            popupProps[propsKey] = getByPaths(input, dataPath)
        } else {
            popupProps[propsKey] = input
        }
    }
    return loadRefComponent(componentInfo, popupProps);
}

const FastballPopup: React.FC<PopupProps> = ({ trigger, popupInfo, onClose, input, __designMode }) => {
    const { triggerType, placementType, popupType, popupComponent, title, width } = popupInfo;
    const [open, setOpen] = React.useState(false);
    const [actions, setActions] = React.useState([]);

    const closePopup = () => {
        setOpen(false);
        if (onClose) {
            onClose();
        }
    }

    if (popupType === 'Popover') {
        const content = buildPopupComponent(popupComponent, { closePopup, __designMode }, input)
        const onOpenChange = (visible: boolean) => visible ? setOpen(true) : closePopup()
        // const forceRender = triggerType === 'Hover'
        const popoverProps: PopoverProps = { title, onOpenChange, open, content, placement: placementType, arrowPointAtCenter: true }
        if (width) {
            popoverProps.overlayStyle = { width }
        }
        if (triggerType === 'Click') {
            popoverProps.trigger = 'click'
        } else if (triggerType === 'ContextMenu') {
            popoverProps.trigger = 'contextMenu'
        }
        return <Popover {...popoverProps}>{trigger}</Popover>
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

    let popupWrapperComponent;
    const content = buildPopupComponent(popupComponent, { closePopup, setActions, __designMode }, input)
    const popupProps: ModalProps = { title, open, footer: actions }
    if (width) {
        popupProps.width = width
    }
    if (popupType === 'Modal') {
        popupWrapperComponent = <Modal onCancel={closePopup} {...popupProps}>{content}</Modal>
    } else if (popupType === 'Drawer') {
        popupWrapperComponent = <Drawer onClose={closePopup} placement={placementType} {...popupProps}>{content}</Drawer>
    }

    return (
        <>
            {triggerComponent}
            {popupWrapperComponent}
        </>
    )
}

export default FastballPopup;