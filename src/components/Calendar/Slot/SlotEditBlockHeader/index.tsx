import styles from './styles.module.scss'
import {TextButton} from "../../../Shared/Buttons/TextButton";
import {WorkingHoursList} from "../../../../types/calendar.ts";
import {useStateContext} from "../../../../contexts";
import {Spinner} from "../../../Shared/Spinner";

type Props = {
    workingHours: WorkingHoursList[],
    handleCopyPreviousDay: () => void
    isLoading: boolean
}
export const SlotEditBlockHeader = ({workingHours, handleCopyPreviousDay, isLoading}: Props) => {

    const {dispatch} = useStateContext()

    const reservedTimeSlotIds = workingHours
        ?.filter(item => item.reserved)
        ?.map(item => item.time_slot_id)

    const handleSetAll = () => {
        const allTimeSlotIds = workingHours
            ?.map(item => item.time_slot_id)
        dispatch({
            type: 'SET_SELECTED_TIME_SLOTS_IDS',
            payload: allTimeSlotIds
        })
    }

    const handleClearAll = () => {
        dispatch({
            type: 'SET_SELECTED_TIME_SLOTS_IDS',
            payload: reservedTimeSlotIds
        })
    }

    return (
            <div className={styles.container}>
                <div className={styles.container_title}>
                    <div>
                        Повторить предыдущий:
                    </div>
                    {isLoading ? <Spinner text/> : <TextButton
                            text={'день'}
                            type={"primary"}
                            action={handleCopyPreviousDay}
                            disabled={reservedTimeSlotIds.length > 0}
                        />
                       }
                </div>
                <div className={styles.container_actions}>
                    <TextButton
                        text={'Выделить все'}
                        type={"primary"}
                        action={handleSetAll}
                    />
                    /
                    <TextButton
                        text={'Отменить все'}
                        type={"primary"}
                        action={handleClearAll}
                        disabled={reservedTimeSlotIds.length > 0}
                    />
                </div>
            </div>
    );
};
