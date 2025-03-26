import styles from "./styles.module.scss";
import { useStateContext } from "../../../contexts";
import { CustomSearchInput } from "../../Shared/CustomSearchInput";
import { Button } from "antd";

type Props = {};
const Filters = ({}: Props) => {
  const { dispatch } = useStateContext();

  return (
    <div className={styles.container}>
      <CustomSearchInput
        action={(value) => {
          dispatch({ type: "SET_VISITS_QUERY", payload: value });
        }}
      />
      <Button type="primary" ghost>
        Дата записи
      </Button>
    </div>
  );
};

export default Filters;
