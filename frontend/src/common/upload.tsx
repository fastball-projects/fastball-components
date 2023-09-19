import { buildJsonRequestInfo, callApi, doApiAction } from "./action";

export const upload = async ({ file, onSuccess, onError }) => {
    const resp = await callApi('/api/fastball/storage/generateUploadUrl')
    const requestInfo = {
        method: 'PUT',
        headers: {
            'Content-Type': file.type
        },
        body: file,
    }
    await window.fetch(resp.url, requestInfo);
    const url = new URL(resp.url)
    const fileUrl = url.origin + url.pathname
    file.url = fileUrl
    onSuccess(fileUrl)
}

export const preview = async (file) => {
    return file.url
}