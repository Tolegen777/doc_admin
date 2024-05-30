import styles from './styles.module.scss'
import {SlotEditBlockHeader} from "../SlotEditBlockHeader";
import {WorkingHoursList} from "../../../../types/calendar.ts";
import {SlotEditBlockContent} from "../SlotEditBlockContent";
import {useState} from "react";

type Props = {
    workingHours: WorkingHoursList[]
   prevWorkingHours: WorkingHoursList[]
}
export const SlotEditBlock = ({workingHours, prevWorkingHours}: Props) => {

    const [selectedTimeSlotIds, setSelectedTimeSlotIds] = useState<number[]>([]);
    const [isPrevDay, setIsPrevDay] = useState(false)

    return (
        <div className={styles.container}>
            <SlotEditBlockHeader
                workingHours={isPrevDay ? prevWorkingHours : workingHours}
                setSelectedTimeSlotIds={setSelectedTimeSlotIds}
                setIsPrevDay={setIsPrevDay}
            />
            <SlotEditBlockContent
                workingHours={isPrevDay ? prevWorkingHours : workingHours}
                selectedTimeSlotIds={selectedTimeSlotIds}
                setSelectedTimeSlotIds={setSelectedTimeSlotIds}
            />
        </div>
    );
};
