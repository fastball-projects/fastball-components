import React from 'react'
import { Button, message } from 'antd';
import { MD5 } from 'object-hash'
import type { ActionInfo, ApiActionInfo, PopupActionInfo, Data, PopupProps, LookupActionInfo, PrintActionInfo, PrintProps } from '../../types'
import FastballPopup from './components/Popup'
import FastballActionButton from './components/ActionButton';
import FastballPrint from './components/Printer';

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
    const requestInfo = buildJsonRequestInfo();
    requestInfo.body = JSON.stringify([data])
    const resp = await window.fetch(`/api/fastball/lookup/${actionInfo.lookupKey}`, requestInfo)
    const json = await resp.text();
    if (json) {
        return JSON.parse(json);
    }
    // const actionRequest = { actionInfo, data }
    // const actionCacheHash = MD5(actionRequest);
    // if (!lookupActionCache[actionCacheHash]) {
    //     const requestInfo = buildJsonRequestInfo();
    //     requestInfo.body = JSON.stringify([data])
    //     const resp = await window.fetch(`/api/fastball/lookup/${actionInfo.lookupKey}`, requestInfo)
    //     const json = await resp.text();
    //     if (json) {
    //         const lookupItems = JSON.parse(json);
    //         lookupActionCache[actionCacheHash] = lookupItems;
    //     }
    // }
    // return lookupActionCache[actionCacheHash]
}

export const buildAction = (actionInfo: ActionInfo) => {
    if (actionInfo.type === 'API') {
        const apiActionInfo = actionInfo as ApiActionInfo
        if(apiActionInfo.needArrayWrapper !== false) {
            apiActionInfo.needArrayWrapper = true;
        }
        return <FastballActionButton key={apiActionInfo.actionKey} {...apiActionInfo} />
    } else if (actionInfo.type === 'Popup') {
        const popupActionInfo = actionInfo as PopupActionInfo
        return doPopupAction(popupActionInfo)
    } else if (actionInfo.type === 'Print') {
        const printActionInfo = actionInfo as PrintActionInfo
        debugger
        return doPrintAction(printActionInfo)
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

export const doPrintAction = (printActionInfo: PrintActionInfo) => {
    const printProps: PrintProps = {
        key: printActionInfo.actionKey,
        ref: printActionInfo.ref,
        printComponent: printActionInfo.printComponent,
        onClose: printActionInfo.callback,
        trigger: printActionInfo.trigger || <Button>{printActionInfo.actionName || printActionInfo.actionKey}</Button>,
        input: printActionInfo.data
    }
    return <FastballPrint {...printProps} />;
}

export const doApiAction = async (actionInfo: ApiActionInfo, file?: File | Blob) => {
    const { componentKey, actionKey } = actionInfo;
    const data = await buildRequestData(actionInfo);
    let url:string;
    if(actionInfo.downloadFileAction) {
        url = `/api/fastball/component/${componentKey}/downloadAction/${actionKey}`
        return await postDownload(url, data, file, actionInfo.callback)
    }
    url = `/api/fastball/component/${componentKey}/action/${actionKey}`
    return await callApi(url, data, file, actionInfo.callback)
}

const postDownload = async (url: string, data?: any, file?: File | Blob, callback?: Function) => {
    const requestInfo = buildJsonRequestInfo();
    const formData = new FormData();
    if (file) {
        formData.append('file', file)
    }
    formData.append('data', new Blob([JSON.stringify(data)], {
        type: "application/json"
    }));
    requestInfo.body = formData
    try {
        const resp = await window.fetch(url, requestInfo)
        if (callback) {
            callback()
        }
        const filename = resp.headers.get('content-disposition')?.split(';')[1].split('=')[1] || '下载文件'
        const blob = await resp.blob()
     
        const link = document.createElement('a')
        link.download = decodeURIComponent(filename)
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(link.href)
        document.body.removeChild(link)
    } catch(e) {
        message.error(`Error ${e}`);
    }
 }
 

export const callApi = async (url: string, data?: any, file?: File | Blob, callback?: Function) => {
    const requestInfo = buildJsonRequestInfo();
    const formData = new FormData();
    if (file) {
        formData.append('file', file)
    }
    formData.append('data', new Blob([JSON.stringify(data)], {
        type: "application/json"
    }));
    requestInfo.body = formData
    const resp = await window.fetch(url, requestInfo)
    const json = await resp.text();
    if (json) {
        const result = JSON.parse(json);
        if (result.status === 200) {
            if (callback) {
                callback()
            }
            return result.data;
        }
        if (result.status === 401) {
            location.href = '/login?redirectUrl=' + location.href
        } else {
            message.error(`Error ${result.status}: ${result.message}`);
        }
    }
}

