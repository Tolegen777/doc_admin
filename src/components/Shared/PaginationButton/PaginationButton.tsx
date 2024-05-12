import {Button, Tooltip} from "antd";
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import {useStateContext} from "../../../contexts";

type Props = {
    actionType: 'next' | 'prev'
}
const PaginationButton = ({actionType}: Props) => {

    const {dispatch, state} = useStateContext()

    const handlePaginate = () => {
        const page = actionType === "next" ? state.page + 1 : state.page - 1
            dispatch({
                type: 'SET_PAGE',
                payload: page
            })
    }

    return (
        <Tooltip title="search">
            <Button
                shape="circle"
                icon={actionType === 'next' ? <RightOutlined /> : <LeftOutlined /> }
                onClick={handlePaginate}
            />
        </Tooltip>
    );
};

export default PaginationButton;
