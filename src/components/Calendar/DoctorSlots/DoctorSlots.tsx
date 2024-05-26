import styles from './styles.module.scss'
import {WorkSchedule} from "../../../types/calendar.ts";
import Slot from "../Slot/Slot.tsx";

type Props = {
    slots: WorkSchedule[]
}
const DoctorSlots = ({slots}: Props) => {

    const onSlotOpen = (item: WorkSchedule) => {
        console.log(item)
    }

    return (
        <div className={styles.container}>
            {slots?.map((item, index) => <Slot
                key={index}
                panelColour={item?.panel_colour}
                workingHoursCount={item?.working_hours_count}
                visitsCount={item?.visits_count}
                onSlotOpen={() => onSlotOpen(item)}
            />)}
        </div>
    );
};

export default DoctorSlots;
