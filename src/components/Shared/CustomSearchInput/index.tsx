import {Input} from 'antd';
import {SearchOutlined} from "@ant-design/icons";
import styles from "./styles.module.scss";
import {useCallback} from "react";
import debounce from "debounce";

type Props = {
    action: (searchStr: string) => void
}

export const CustomSearchInput = ({action}: Props) => {

    const onHandleInputChange = useCallback(
        debounce((value: string) => {
            action(value)
        }, 500),
        [],
    );

    return <Input
        prefix={<SearchOutlined/>}
        className={styles.search_input}
        onChange={(event) => {
        onHandleInputChange(event.target.value);
    }}
    />
};
