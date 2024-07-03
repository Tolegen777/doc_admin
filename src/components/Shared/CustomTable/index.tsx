import {Table, TableProps} from 'antd';
import React from "react";

type Props = TableProps & {
    setPage?: React.Dispatch<React.SetStateAction<number>>,
    current?: number,
    total?: number
}

export const CustomTable = ({setPage, current, total, ...props}: Props) => {
    return <Table
        {...props}
        pagination={{
            defaultCurrent: 1,
            total: total,
            current: current,
            pageSizeOptions: [],
            showSizeChanger: false,
            onChange: setPage
        }}
    />
};
