import styles from './styles.module.scss'
import {SlotEditBlockHeader} from "../SlotEditBlockHeader";
import {WorkingHoursList} from "../../../../types/calendar.ts";
import {SlotEditBlockContent} from "../SlotEditBlockContent";

type Props = {
    workingHours: WorkingHoursList[]
}
export const SlotEditBlock = ({workingHours}: Props) => {

    return (
        <div className={styles.container}>
            <SlotEditBlockHeader/>
            <SlotEditBlockContent workingHours={workingHours}/>
        </div>
    );
};
