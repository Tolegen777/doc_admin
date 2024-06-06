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

    const handleSetAll = () => {
        const allTimeSlotIds = workingHours?.filter(item => item?.doctor_availability)?.map(item => item.time_slot_id)
        dispatch({
            type: 'SET_SELECTED_TIME_SLOTS_IDS',
            payload: allTimeSlotIds
        })
    }

    const handleClearAll = () => {
        dispatch({
            type: 'SET_SELECTED_TIME_SLOTS_IDS',
            payload: []
        })
    }

    return (
            <div className={styles.container}>
                <div className={styles.container_title}>
                    <div>
                        Повторить предыдущий:
                    </div>
                    {isLoading ? <Spinner text/> : <div
                        className={styles.container_title_link}
                        onClick={handleCopyPreviousDay}
                    >
                        день
                    </div>}
                </div>
                <div className={styles.container_actions}>
                    <TextButton text={'Выделить все'} type={"primary"} action={handleSetAll}/>
                    /
                    <TextButton text={'Отменить все'} type={"primary"} action={handleClearAll}/>
                </div>
            </div>
    );
};
