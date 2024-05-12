import styles from './styles.module.scss'
import {clsx} from "clsx";

type Props = {
  slot: {
      count: number
  }
}
const Slot = ({}: Props) => {
    return (
        <div className={clsx({
            [styles.container]: true,
            [styles.container_enabled]: true
        })}>
          <div className={styles.container_title}>0</div>
          <div className={styles.container_sub_title}>0</div>
          {/*<div className={styles.container_empty_title}>{slot?.count}</div>*/}
        </div>
    );
};

export default Slot;
