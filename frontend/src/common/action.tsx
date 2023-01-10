import React, { ComponentClass, FC, ReactElement } from 'react'
import { Button } from 'antd';
import type { ActionInfo, ApiActionInfo, PopupActionInfo, Data, PopupProps, LookupActionInfo } from '../../types'
import { loadRefComponent } from './'
import FastballPopup from './Popup'

const buildJsonRequestInfo = (): RequestInit => ({
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
})

const buildRequestData = async (actionInfo: ActionInfo) => {
    let data: Data | Data[] | undefined = actionInfo.data
    if (actionInfo.loadData) {
        data = await actionInfo.loadData()
    }
    return data;
}

export const doLookupAction = async (actionInfo: LookupActionInfo, data?: Data) => {
    const requestInfo = buildJsonRequestInfo();
    requestInfo.body = JSON.stringify([data])
    const resp = await window.fetch(`/api/fastball/lookup/${actionInfo.lookupKey}`, requestInfo)
    const json = await resp.text();
    if (json) {
        return JSON.parse(json);
    }
}

export const buildAction = (actionInfo: ActionInfo) => {
    if (actionInfo.type === 'API') {
        const apiActionInfo = actionInfo as ApiActionInfo
        const execute = async () => {
            const res = await doApiAction(apiActionInfo);
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
        width: popupActionInfo.width,
        title: popupActionInfo.popupTitle,
        popupType: popupActionInfo.popupType,
        placementType: popupActionInfo.placementType,
        onClose: popupActionInfo.callback,
        trigger: popupActionInfo.trigger || <Button>{popupActionInfo.actionName || popupActionInfo.actionKey}</Button>,
        popupComponent: popupActionInfo.popupComponent,
        input: popupActionInfo.data
    }
    return <FastballPopup {...popupProps} />;
}

export const doApiAction = async (actionInfo: ApiActionInfo) => {
    const { componentKey, actionKey } = actionInfo;
    const data = await buildRequestData(actionInfo);
    const requestInfo = buildJsonRequestInfo();
    requestInfo.body = JSON.stringify(data)
    const resp = await window.fetch(`/api/fastball/component/${componentKey}/action/${actionKey}`, requestInfo)
    const json = await resp.text();
    if (actionInfo.callback) {
        actionInfo.callback()
    }
    if (json) {
        return JSON.parse(json);
    }
}

