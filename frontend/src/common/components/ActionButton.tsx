import { Button, Popconfirm, Upload, UploadProps, message } from "antd";
import React, { useState, useContext } from "react";
import { currentBusinessContextId } from "fastball-frontend-common";
import { ApiActionInfo } from "../../../types";
import { doApiAction } from "../action";
import { FastballContext } from "../../components/FastballContext";

const FastballActionButton: React.FC<ApiActionInfo> = (props) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const { actionKey, actionName, trigger, confirmMessage, uploadFileAction } = props;

    const containerContext = useContext(FastballContext)
    const container = containerContext?.container
    const getContainer = container ? () => container : undefined;

    const execute = async () => {
        setLoading(true)
        try {
            await doApiAction(props);
        } catch (error) {
            console.error('Execute button action error', error)
        }
        setLoading(false)
    }

    const showPopconfirm = () => {
        setOpen(true);
    };

    const handleOk = async () => {
        setConfirmLoading(true);
        try {
            await execute();
            setOpen(false);
            setConfirmLoading(false);
        } catch (error) {
            setConfirmLoading(false);
        } finally {
            setConfirmLoading(false);
        }
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
        getPopupContainer={getContainer}
        getTooltipContainer={getContainer}
        title={confirmMessage}
        open={open}
        onConfirm={handleOk}
        okButtonProps={{ loading: confirmLoading }}
        onCancel={handleCancel}
    >{trigger ? <span key={actionKey} onClick={showPopconfirm}>{trigger}</span> : (<Button key={actionKey} onClick={showPopconfirm} loading={loading}>{actionName || actionKey}</Button>)}</Popconfirm>

}

export default FastballActionButton;