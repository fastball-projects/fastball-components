import React from 'react'
import { Button } from 'antd';
import { MD5 } from 'object-hash'
import type { ActionInfo, ApiActionInfo, PopupActionInfo, Data, PopupProps, LookupActionInfo } from '../../types'
import FastballPopup from './components/Popup'
import FastballActionButton from './components/ActionButton';

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

// TODO use cache
const lookupActionCache: Record<string, any[]> = {}

export const doLookupAction = async (actionInfo: LookupActionInfo, data?: Data, __designMode?: string) => {
    if (__designMode === 'design') {
        return [];
    }
    const actionRequest = { actionInfo, data }
    const actionCacheHash = MD5(actionRequest);
    if (!lookupActionCache[actionCacheHash]) {
        const requestInfo = buildJsonRequestInfo();
        requestInfo.body = JSON.stringify([data])
        const resp = await window.fetch(`/api/fastball/lookup/${actionInfo.lookupKey}`, requestInfo)
        const json = await resp.text();
        if (json) {
            const lookupItems = JSON.parse(json);
            lookupActionCache[actionCacheHash] = lookupItems;
        }
    }
    return lookupActionCache[actionCacheHash]
}

export const buildAction = (actionInfo: ActionInfo) => {
    if (actionInfo.type === 'API') {
        const apiActionInfo = actionInfo as ApiActionInfo
        return <FastballActionButton {...apiActionInfo} />
    } else if (actionInfo.type === 'Popup') {
        const popupActionInfo = actionInfo as PopupActionInfo
        return doPopupAction(popupActionInfo)
    } else {
        return null
    }
}

export const doPopupAction = (popupActionInfo: PopupActionInfo) => {
    const popupProps: PopupProps = {
        key: popupActionInfo.actionKey,
        ref: popupActionInfo.ref,
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

