import React from "react";
import { Button, Modal } from "antd";
import { buildAction, doApiAction } from "../../common";
import { BasicComponentProps } from "../../../types";

const FastballExcelImporter: React.FC<BasicComponentProps> = ({
  componentKey,
}) => {
  const downloadTemplate = async () => {
    await doApiAction({
      componentKey,
      type: "API",
      actionKey: "buildExcelTemplate",
      downloadFileAction: true,
      data: [],
    });
  };

  return (
    <>
      <Button onClick={downloadTemplate}>下载模板</Button>
      {buildAction({
        componentKey,
        type: "API",
        actionKey: "importData",
        uploadFileAction: true,
        data: [],
      })}
    </>
  );
};

export default FastballExcelImporter;
