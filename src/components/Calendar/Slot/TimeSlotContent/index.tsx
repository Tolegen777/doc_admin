import styles from './styles.module.scss';
import {clsx} from "clsx";
import {WorkingHoursList} from "../../../../types/calendar.ts";
import {removeSeconds} from "../../../../utils/date/getDates.ts";
import {memo} from "react";
import {useStateContext} from "../../../../contexts";

type Props = {
    timeSlot: WorkingHoursList;
}

export const TimeSlotContent = memo(({timeSlot}: Props) => {

    const {state, dispatch} = useStateContext()

    const {selectedTimeSlotIds} = state

    const handleChangeTimeSlot = (item: WorkingHoursList) => {
        const newState = [...selectedTimeSlotIds];
        const index = newState.indexOf(item.time_slot_id);
        if (index !== -1) {
            newState.splice(index, 1);
        } else if (item.doctor_availability) {
            newState.push(item.time_slot_id);
        }
        dispatch({
            type: 'SET_SELECTED_TIME_SLOTS_IDS',
            payload: newState
        })
        // setSelectedTimeSlotIds(prevState => {
        //     const newState = [...prevState];
        //     const index = newState.indexOf(item.time_slot_id);
        //     if (index !== -1) {
        //         newState.splice(index, 1);
        //     } else if (item.doctor_availability) {
        //         newState.push(item.time_slot_id);
        //     }
        //     return newState;
        // });
    };

    return (
        <div
            className={clsx({
                [styles.container]: true,
                [styles.container_not_available]: !timeSlot?.doctor_availability,
                [styles.container_reserved]: selectedTimeSlotIds.includes(timeSlot?.time_slot_id),
                ['mouse-select__selectable']: true
            })}
            onClick={() => handleChangeTimeSlot(timeSlot)}
            data-id={timeSlot?.doctor_availability ? timeSlot?.time_slot_id : null}
        >
            {removeSeconds(timeSlot?.start_time)}
        </div>
    );
});
