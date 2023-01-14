import { Button } from "antd";
import React from "react";
import { ApiActionInfo } from "../../../types";
import { doApiAction } from "../action";

const FastballActionButton: React.FC<ApiActionInfo> = (props) => {
    const { actionKey, actionName, trigger } = props;
    const execute = async () => await doApiAction(props);

    return trigger ? <span key={actionKey} onClick={execute}>{trigger}</span> : (<Button key={actionKey} onClick={execute}>{actionName || actionKey}</Button>)
}

export default FastballActionButton;