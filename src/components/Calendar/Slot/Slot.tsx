import styles from './styles.module.scss'
import {clsx} from "clsx";
import {PanelColourType} from "../../../types/calendar.ts";

type Props = {
  panelColour: PanelColourType
  visitsCount: number
  workingHoursCount: number
}
const Slot = ({panelColour, visitsCount, workingHoursCount}: Props) => {
    return (
        <div className={clsx({
            [styles.container]: true,
            [styles.container_enabled]: panelColour === 'green',
            [styles.container_disabled]: panelColour === 'red'
        })}>
          <div className={styles.container_title}>{visitsCount}</div>
          <div className={styles.container_sub_title}>{workingHoursCount}</div>
            {panelColour === 'white' && <div className={styles.container_empty_title}>o</div>}
        </div>
    );
};

export default Slot;
