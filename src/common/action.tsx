import { ComponentClass, FC, ReactElement } from 'react'
import { Button } from 'antd';
import type { ActionInfo, ApiActionInfo, PopupActionInfo, Data } from '../../types'

const PreviewComponent: FC | ComponentClass = window.PreviewComponent

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
    if (PreviewComponent) {
        return (<PreviewComponent onClose={actionInfo.callback} componentClassName={actionInfo.componentClass} data={actionInfo.data} trigger={<a>{actionInfo.actionName || actionInfo.actionKey}</a>} />)
    } else if (actionInfo.component) {
        const PopupComponent = actionInfo.component;
        return (<PopupComponent onClose={actionInfo.callback} data={actionInfo.data} trigger={<a>{actionInfo.actionName || actionInfo.actionKey}</a>} />)
    } else {
        return null
    }
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
    if (data) {
        requestInfo.body = JSON.stringify([data])
    }
    const resp = await window.fetch(`/api/fastball/component/${componentKey}/action/${actionKey}`, requestInfo)
    const json = await resp.text();
    if (json) {
        return JSON.parse(json);
    }
}