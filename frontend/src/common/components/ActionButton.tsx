import { Button, Popconfirm, Upload, UploadProps, message } from "antd";
import React, { useState } from "react";
import { ApiActionInfo } from "../../../types";
import { callApi, doApiAction } from "../action";

const FastballActionButton: React.FC<ApiActionInfo> = (props) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const { actionKey, actionName, trigger, confirmMessage, uploadFileAction } = props;
    const execute = async () => {
        setLoading(true)
        await doApiAction(props);
        setLoading(false)
    }

    const showPopconfirm = () => {
        setOpen(true);
    };

    const handleOk = async () => {
        setConfirmLoading(true);
        await execute();
        setOpen(false);
        setConfirmLoading(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    let actionComponent;
    if (uploadFileAction) {
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
        return <Upload {...uploadProps}>{trigger || <Button key={actionKey} loading={loading}>{actionName || actionKey}</Button>}</Upload>
    } else if (!confirmMessage) {
        return trigger ? <span key={actionKey} onClick={execute}>{trigger}</span> : (<Button key={actionKey} onClick={execute} loading={loading}>{actionName || actionKey}</Button>);
    }
    return <Popconfirm
        title={confirmMessage}
        open={open}
        onConfirm={handleOk}
        okButtonProps={{ loading: confirmLoading }}
        onCancel={handleCancel}
    >{trigger ? <span key={actionKey} onClick={showPopconfirm}>{trigger}</span> : (<Button key={actionKey} onClick={showPopconfirm} loading={loading}>{actionName || actionKey}</Button>)}</Popconfirm>

}

export default FastballActionButton;