import { ComponentClass, FC, ReactElement } from 'react'
import { Button } from 'antd';
import type { ActionInfo, ApiActionInfo, PopupActionInfo, Data } from '../../types'
import { loadRefComponent } from './'

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
        return (<Button key={actionInfo.actionKey} type="link" onClick={execute}>{actionInfo.actionName || actionInfo.actionKey}</Button>)
    } else if (actionInfo.type === 'Popup') {
        const popupActionInfo = actionInfo as PopupActionInfo
        return doPopupAction(popupActionInfo)
    } else {
        return null
    }
}

export const doPopupAction = (actionInfo: PopupActionInfo) => {
    const popupComponent = loadRefComponent(actionInfo.popupComponent, {
        onClose: actionInfo.callback,
        data: actionInfo.data,
        trigger: <a>{actionInfo.actionName || actionInfo.actionKey}</a>
    })
    return popupComponent;
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