import React, { useEffect } from "react";
import { Button, Modal } from "antd";
import { buildAction, doApiAction, FastballFieldProvider } from "../../common";
import {
  ApiActionInfo,
  BasicComponentProps,
  Data,
  TableData,
} from "../../../types";
import { ActionType, ProTable, ProTableProps } from "@fastball/pro-components";


const FastballExcelImporter: React.FC<BasicComponentProps> = ({
  componentKey,
  container,
}) => {


  const ref = React.useRef<ActionType>();
  const reloadData = () => {
    ref.current?.reload();
    setTimeout(() => {
      reloadData();
    }, 1000);
  }

  useEffect(() => {
    reloadData();
  }, []);

  const props: ProTableProps<Data, any> = {
    search: false,
    columns: [
      {
        title: "导入时间",
        dataIndex: "importTime",
        valueType: "dateTime",
      },
      {
        title: "导入文件",
        dataIndex: "importFile",
        valueType: "Attachment",
      },
      {
        title: "状态",
        dataIndex: "state",
        valueType: "select",
        valueEnum: {
          SUCCESS: {
            text: "导入成功",
            color: "#00CC99",
          },
          PARTIAL_SUCCESS: {
            text: "部分成功",
            color: "#CC6600",
          },
          FAIL: {
            text: "导入失败",
            color: "#CC0000",
          },
          IMPORTING: {
            text: "导入中",
            color: "#00CCFF",
          },
        },
      },
      {
        title: "导入总条数",
        dataIndex: "totalCount",
      },
      {
        title: "成功总条数",
        dataIndex: "successCount",
      },
      {
        title: "失败总条数",
        dataIndex: "failCount",
      },
      {
        title: "导入结果",
        dataIndex: "resultFile",
        valueType: "Attachment",
      },
    ],
    request: async (params, sortFields) => {
      const { pageSize, current, keyword } = params;
      const searchParam = { sortFields, pageSize, current, keyword };
      const apiActionInfo: ApiActionInfo = {
        componentKey,
        type: "API",
        actionKey: "historyRecordList",
        data: [searchParam],
      };
      const result: Data[] = await doApiAction(apiActionInfo);
      return result;
    },
    rowKey: "id"
  };

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
        actionName: "导入",
        uploadFileAction: true,
        data: [],
      })}
      <FastballFieldProvider container={container}>
        <ProTable<Data> actionRef={ref} {...props} />
      </FastballFieldProvider>
    </>
  );
};

export default FastballExcelImporter;
