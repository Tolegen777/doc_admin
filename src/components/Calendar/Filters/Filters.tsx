import styles from './styles.module.scss'
import {Button, Input} from "antd";
import {SearchOutlined, ReloadOutlined} from '@ant-design/icons';
import PaginationButton from "../../Shared/PaginationButton/PaginationButton.tsx";
import {useCallback} from "react";
import {useStateContext} from "../../../contexts";
import debounce from 'debounce';
import {useQueryClient} from "@tanstack/react-query";

type Props = {}
const Filters = ({}: Props) => {

    const {dispatch, state} = useStateContext()

    const queryClient = useQueryClient()

    const onHandleInputChange = useCallback(
        debounce((value: string) => {
            dispatch({type: 'SET_SEARCH_QUERY', payload: value});
        }, 500),
        [],
    );

    const handleReload = () => {
        queryClient.invalidateQueries({ queryKey: ['calendarData'] })
    }

    return (
        <div className={styles.container}>
            <div className={styles.container_search}>
                <Input prefix={<SearchOutlined/>} className={styles.container_search_input} onChange={(event) => {
                    onHandleInputChange(event.target.value);
                }}/>
                <Button className={styles.container_search_btn} onClick={handleReload}><ReloadOutlined/></Button>
            </div>
            <div className={styles.container_pagination}>
                {state.page > 1 && <PaginationButton actionType={'prev'}/>}
                <PaginationButton actionType={'next'}/>
            </div>
        </div>
    );
};

export default Filters;
