import { Table, TableProps } from "antd";
import React from "react";

type Props = TableProps & {
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  current?: number;
  total?: number;
  hidePagination?: boolean
};

export const CustomTable = ({ setPage, current, total,hidePagination, ...props }: Props) => {
  return (
    <Table
      {...props}
      pagination={!hidePagination ? {
        defaultCurrent: 1,
        total: total,
        current: current,
        pageSizeOptions: [],
        showSizeChanger: false,
        onChange: setPage,
      } : false}
      locale={{ emptyText: "Данных нет..." }}
      scroll={{ x: 1000 }}
    />
  );
};
