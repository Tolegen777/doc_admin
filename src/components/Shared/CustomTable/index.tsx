import {Table, TableProps} from 'antd';

type Props = TableProps

export const CustomTable = ({...props}: Props) => {
    return <Table {...props}/>
};
