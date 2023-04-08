import React from 'react'
import { Button, message } from 'antd';
import { MD5 } from 'object-hash'
import type { ActionInfo, ApiActionInfo, PopupActionInfo, Data, PopupProps, LookupActionInfo } from '../../types'
import FastballPopup from './components/Popup'
import FastballActionButton from './components/ActionButton';

const TOKEN_LOCAL_KEY = 'fastball_token';

const buildJsonRequestInfo = (): RequestInit => {

    const tokenJson = localStorage.getItem(TOKEN_LOCAL_KEY)
    let authorization: string = '';
    if (tokenJson) {
        const { token, expiration } = JSON.parse(tokenJson);
        if (Date.now() < expiration) {
            authorization = token;
        } else {
            localStorage.removeItem(TOKEN_LOCAL_KEY)
        }
    }
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            AUTHORIZATION_HEADER_KEY: authorization
        }
    }
    return request;
}

const buildRequestData = async (actionInfo: ApiActionInfo) => {
    let data: Data | Data[] | undefined = actionInfo.data
    if (actionInfo.loadData) {
        data = await actionInfo.loadData()
    }
    if (actionInfo.needArrayWrapper) {
        return [data];
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
        apiActionInfo.needArrayWrapper = true;
        return <FastballActionButton key={apiActionInfo.actionKey} {...apiActionInfo} />
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
        popupInfo: popupActionInfo.popupInfo,
        onClose: popupActionInfo.callback,
        trigger: popupActionInfo.trigger || <Button>{popupActionInfo.actionName || popupActionInfo.actionKey}</Button>,
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
        const result = JSON.parse(json);
        if (result.status === 200) {
            return result.data;
        }
        if (result.status === 401) {
            location.href = '/login?redirectUrl=' + location.href
        } else {
            message.error(`Error ${result.status}: ${result.message}`);
        }
    }
}

