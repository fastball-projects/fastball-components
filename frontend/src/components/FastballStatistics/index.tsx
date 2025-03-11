import { FC, useEffect, useState } from "react";
import { StatisticsProps } from "../../../types";
import { Statistic } from "antd";
import React from "react";
import { doApiAction } from "../../common";

const FastballStatistics: FC<StatisticsProps> = ({
  componentKey,
  fields,
  input,
}) => {
  const [statisticsData, setStatisticsData] = useState<any>();
  const [loading, setLoading] = useState(true);

  const initLoadData = async () => {
    const res = await doApiAction({
      componentKey,
      type: "API",
      actionKey: "loadData",
      data: [input],
    });
    setStatisticsData(res || {});
    setLoading(false);
  };

  useEffect(() => {
    initLoadData();
  }, [input]);

  const statisticFields = fields.map((field) => {
    const config = {
      key: field.name,
      title: field.title,
      prefix: field.prefix,
      suffix: field.suffix,
      precision: field.precision,
      value: statisticsData?.[field.name],
      loading,
    };
    if (field.color) {
      config.valueStyle = { color: field.color };
    }
    return <Statistic style={{ flex: 1 }} {...config} />;
  });
  return <div style={{ display: "flex" }}>{statisticFields}</div>;
};

export default FastballStatistics;
