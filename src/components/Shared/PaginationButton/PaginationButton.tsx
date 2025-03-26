import { Button, Tooltip } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { useStateContext } from "../../../contexts";
import styles from "./styles.module.scss";

type Props = {
  actionType: "next" | "prev";
};
const PaginationButton = ({ actionType }: Props) => {
  const { dispatch, state } = useStateContext();

  const handlePaginate = () => {
    const page = actionType === "next" ? state.page + 1 : state.page - 1;
    dispatch({
      type: "SET_PAGE",
      payload: page,
    });
  };

  return (
    <Tooltip title={actionType === "next" ? "следующий" : "предыдущий"}>
      <Button
        shape="circle"
        icon={
          actionType === "next" ? (
            <RightOutlined className={styles.icon} />
          ) : (
            <LeftOutlined className={styles.icon} />
          )
        }
        onClick={handlePaginate}
        className={styles.btn}
      />
    </Tooltip>
  );
};

export default PaginationButton;
