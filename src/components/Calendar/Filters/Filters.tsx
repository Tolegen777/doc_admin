import styles from './styles.module.scss'
import {Button} from "antd";
import {ReloadOutlined} from '@ant-design/icons';
import PaginationButton from "../../Shared/PaginationButton/PaginationButton.tsx";
import {useStateContext} from "../../../contexts";
// import {useQueryClient} from "@tanstack/react-query";
import {CustomSearchInput} from "../../Shared/CustomSearchInput";
import CustomPagination from "../../Shared/CustomPagination";

type Props = {
    setPage: (page: number) => void,
    total: number
}
const Filters = ({setPage, total}: Props) => {

    const {dispatch, state} = useStateContext()

    const handleReload = () => {
        // queryClient.invalidateQueries({ queryKey: ['calendarData'] })
        window?.location?.reload()
    }

    return (
        <div className={styles.container}>
            <div className={styles.container_search}>
                <CustomSearchInput
                    action={(value) => {
                    dispatch({type: 'SET_SEARCH_QUERY', payload: value})
                }}
                />
                <Button className={styles.container_search_btn} onClick={handleReload}><ReloadOutlined/></Button>
                <CustomPagination setPage={setPage} totalCount={total}/>
            </div>
            <div className={styles.container_pagination}>
                {state.page > 1 && <PaginationButton actionType={'prev'}/>}
                <PaginationButton actionType={'next'}/>
            </div>
        </div>
    );
};

export default Filters;
