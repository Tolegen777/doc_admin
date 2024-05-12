import styles from './styles.module.scss'
import {WorkSchedule} from "../../../types/calendar.ts";
import Slot from "../Slot/Slot.tsx";

type Props = {
    slots: WorkSchedule[]
}
const DoctorSlots = ({slots}: Props) => {
    return (
        <div className={styles.container}>
            {slots?.map((item, index) => <Slot key={index} slot={{
                count: item?.working_hours?.length ?? 0
            }} />)}
        </div>
    );
};

export default DoctorSlots;
