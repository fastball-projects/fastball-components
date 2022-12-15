import type { ActionInfo, ApiActionInfo, Data } from '../../types'

export const doAction = async (actionInfo: ActionInfo, data?: Data | Data[]) => {
    console.log('do action', actionInfo, data)
    if (actionInfo.type === 'API') {
        const apiActionInfo = actionInfo as ApiActionInfo
        return await doApiAction(apiActionInfo, data);
    }
}

export const doApiAction = async (actionInfo: ApiActionInfo, data?: Data | Data[]) => {
    const { componentKey, actionKey } = actionInfo;
    const requestInfo: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    if (data) {
        requestInfo.body = JSON.stringify(data)
    }
    const resp = await window.fetch(`/api/fastball/component/${componentKey}/action/${actionKey}`, requestInfo)
    const json = await resp.text();
    if (json) {
        return JSON.parse(json);
    }
}