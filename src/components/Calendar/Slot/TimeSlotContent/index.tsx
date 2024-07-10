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
        } else if (!item.reserved) {
            newState.push(item.time_slot_id);
        }
        dispatch({
            type: 'SET_SELECTED_TIME_SLOTS_IDS',
            payload: newState
        })

        dispatch({
            type: 'SET_VISIT_ID',
            payload: null
        })
    };

    return (
        <div
            className={clsx({
                [styles.container]: true,
                [styles.container_active]: selectedTimeSlotIds.includes(timeSlot?.time_slot_id) && timeSlot?.panel_colour !== 'grey',
                [styles.container_not_available]: timeSlot?.panel_colour === 'grey',
                ['mouse-select__selectable']: true
            })}
            onClick={() => {
                if (timeSlot?.panel_colour === 'grey') {
                    dispatch({
                        type: 'SET_VISIT_ID',
                        payload: timeSlot?.patient_clinic_visit_id ?? null
                    })
                } else {
                    handleChangeTimeSlot(timeSlot)
                }
            }}
            data-id={!timeSlot?.reserved ? timeSlot?.time_slot_id : null}
        >
            {removeSeconds(timeSlot?.start_time)}
        </div>
    );
});
