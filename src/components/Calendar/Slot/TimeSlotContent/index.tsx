import styles from './styles.module.scss';
import {clsx} from "clsx";
import {WorkingHoursList} from "../../../../types/calendar.ts";
import {removeSeconds} from "../../../../utils/date/getDates.ts";
import {Dispatch, memo, SetStateAction} from "react";

type Props = {
    timeSlot: WorkingHoursList;
    setSelectedTimeSlotIds: Dispatch<SetStateAction<Set<number>>>;
    selectedTimeSlotIds: Set<number>;
}

export const TimeSlotContent = memo(({timeSlot, setSelectedTimeSlotIds, selectedTimeSlotIds}: Props) => {
    const handleChangeTimeSlot = (item: WorkingHoursList) => {
        setSelectedTimeSlotIds(prevState => {
            const newState = new Set(prevState);
            if (newState.has(item.time_slot_id)) {
                newState.delete(item.time_slot_id);
            } else if (item.doctor_availability) {
                newState.add(item.time_slot_id);
            }
            return newState;
        });
    };

    return (
        <div
            className={clsx({
                [styles.container]: true,
                [styles.container_not_available]: !timeSlot?.doctor_availability,
                [styles.container_reserved]: selectedTimeSlotIds.has(timeSlot?.time_slot_id),
            })}
            onClick={() => handleChangeTimeSlot(timeSlot)}
        >
            {removeSeconds(timeSlot?.start_time)}
        </div>
    );
});
