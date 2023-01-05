import React, { ComponentClass, FC, ReactElement } from 'react'
import { Button } from 'antd';
import type { ActionInfo, ApiActionInfo, PopupActionInfo, Data, PopupProps } from '../../types'
import { loadRefComponent } from './'
import FastballPopup from './Popup'

const buildRequestData = async (actionInfo: ActionInfo) => {
    let data: Data | Data[] | undefined = actionInfo.data
    if (actionInfo.loadData) {
        data = await actionInfo.loadData()
    }
    return data;
}

export const buildAction = (actionInfo: ActionInfo) => {
    console.log('do action', actionInfo)
    if (actionInfo.type === 'API') {
        const apiActionInfo = actionInfo as ApiActionInfo
        const execute = async () => {
            const res = await doApiAction(apiActionInfo);
            if (actionInfo.callback) {
                actionInfo.callback()
            }
        }
        return actionInfo.trigger ? <span key={actionInfo.actionKey} onClick={execute}>{actionInfo.trigger}</span> : (<Button key={actionInfo.actionKey} onClick={execute}>{actionInfo.actionName || actionInfo.actionKey}</Button>)
    } else if (actionInfo.type === 'Popup') {
        const popupActionInfo = actionInfo as PopupActionInfo
        return doPopupAction(popupActionInfo)
    } else {
        return null
    }
}

export const doPopupAction = (popupActionInfo: PopupActionInfo) => {
    const popupProps: PopupProps = {
        popupType: popupActionInfo.popupType,
        drawerPlacementType: popupActionInfo.drawerPlacementType,
        onClose: popupActionInfo.callback,
        trigger: popupActionInfo.trigger || <Button>{popupActionInfo.actionName || popupActionInfo.actionKey}</Button>,
        popupActionInfo
    }

    return <FastballPopup {...popupProps} />;
}

export const doApiAction = async (actionInfo: ApiActionInfo) => {
    const { componentKey, actionKey } = actionInfo;
    const requestInfo: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const data = await buildRequestData(actionInfo);
    requestInfo.body = JSON.stringify([data])
    const resp = await window.fetch(`/api/fastball/component/${componentKey}/action/${actionKey}`, requestInfo)
    const json = await resp.text();
    if (json) {
        return JSON.parse(json);
    }
}