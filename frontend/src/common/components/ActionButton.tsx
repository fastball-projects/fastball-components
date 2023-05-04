import { Button, Upload, UploadProps, message } from "antd";
import React from "react";
import { ApiActionInfo } from "../../../types";
import { callApi, doApiAction } from "../action";

const FastballActionButton: React.FC<ApiActionInfo> = (props) => {
    const { actionKey, actionName, trigger, uploadFileAction } = props;
    const execute = async () => await doApiAction(props);
    if (!uploadFileAction) {
        return trigger ? <span key={actionKey} onClick={execute}>{trigger}</span> : (<Button key={actionKey} onClick={execute}>{actionName || actionKey}</Button>);
    }
    const uploadProps: UploadProps = {
        itemRender: () => <></>,
        customRequest: async ({ file }) => {
            if (file) {
                await doApiAction(props, file)
            }
        },
        async onChange(info) {
            if (info.file.status === 'done') {

            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };
    return <Upload {...uploadProps}>{trigger || <Button key={actionKey}>{actionName || actionKey}</Button>}</Upload>
}

export default FastballActionButton;