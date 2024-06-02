import React, { useContext } from 'react'
import { Modal, Drawer, Popover, PopoverProps, ModalProps, DrawerProps, Space } from 'antd';

import type { PopupInfo, PopupProps, RefComponentInfo } from '../../../types'
import { loadRefComponent } from '../component'
import { getByPaths } from '../utils';
import { FastballContext } from '../../components/FastballContext';

const loadPopupComponent = (popupInfo: PopupInfo, input?: any): RefComponentInfo | null => {
    const { popupComponent, dynamicPopup, dynamicPopupRules, conditionPath } = popupInfo;
    if (!dynamicPopup && popupComponent) {
        return popupComponent;
    }
    if (dynamicPopupRules?.length) {
        let conditionValue = input;
        if (conditionPath?.length) {
            conditionValue = getByPaths(input, conditionPath);
        }
        for (let index = 0; index < dynamicPopupRules.length; index++) {
            const { values, popupComponent } = dynamicPopupRules[index];
            if (values.find((value: any) => conditionValue === value)) {
                return popupComponent
            }
        }
    }
    return null
}

const buildPopupComponent = (popupComponent: RefComponentInfo, props: Record<string, any>, input?: any) => {
    const popupProps: Record<string, any> = {
        ...props
    }
    if (input) {
        if (popupComponent.dataPath?.length > 0) {
            popupProps[popupComponent.propsKey] = getByPaths(input, popupComponent.dataPath)
        } else {
            popupProps[popupComponent.propsKey] = input
        }
    }
    return loadRefComponent(popupComponent.componentInfo, popupProps);
}



const FastballPopup: React.FC<PopupProps> = ({ trigger, popupInfo, onClose, input, loadInput, __designMode }) => {
    const { triggerType, placementType, popupType, title, width } = popupInfo;
    const [open, setOpen] = React.useState(false);
    const [actions, setActions] = React.useState<React.ReactNode>([]);

    const containerContext = useContext(FastballContext)
    const container = containerContext?.container
    const getContainer = container ? () => container : undefined;

    const popupComponent = loadPopupComponent(popupInfo, input);


    const closePopup = React.useCallback(() => {
        setOpen(false);
        if (onClose) {
            onClose();
        }
    }, [onClose]);
    
    if(!popupComponent) {
        return trigger
    }

    if (popupType === 'Popover') {
        const content = buildPopupComponent(popupComponent, { container, closePopup, __designMode }, input)
        const onOpenChange = (visible: boolean) => visible ? setOpen(true) : closePopup()
        // const forceRender = triggerType === 'Hover'
        const popoverProps: PopoverProps = { title, onOpenChange, open, content, placement: placementType, arrowPointAtCenter: true, getPopupContainer: getContainer, getTooltipContainer: getContainer }
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
        triggerComponent = <span onClick={(e) => {
            e.stopPropagation()
            setOpen(true)
        }}>{trigger}</span>;
    }

    let popupWrapperComponent;

    const titleClick = () => {
        navigator.clipboard.writeText(popupComponent.componentInfo.componentClass);
        console.log('Component class: ', popupComponent.componentInfo.componentClass)
    }
    const content = buildPopupComponent(popupComponent, { container, closePopup, setActions, __designMode }, input)
    const titleComponent = <div onClick={titleClick}>{title}</div>
    const popupProps: ModalProps = { title: titleComponent, open, footer: <Space>{actions}</Space>, getContainer }
    if (width) {
        popupProps.width = width
    }
    if (popupType === 'Modal') {
        popupWrapperComponent = <Modal destroyOnClose onCancel={closePopup} {...popupProps}>{content}</Modal>
    } else if (popupType === 'Drawer') {
        popupWrapperComponent = <Drawer destroyOnClose onClose={closePopup} placement={placementType} {...popupProps}>{content}</Drawer>
    }

    return (
        <>
            {triggerComponent}
            {popupWrapperComponent}
        </>
    )
}

export default FastballPopup;