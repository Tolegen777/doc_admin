import styles from './styles.module.scss'
import {TextButton} from "../../../Shared/Buttons/TextButton";
import {WorkingHoursList} from "../../../../types/calendar.ts";
import React from "react";

type Props = {
    workingHours: WorkingHoursList[],
    setSelectedTimeSlotIds: React.Dispatch<React.SetStateAction<number[]>>
    setIsPrevDay: (flag: boolean) => void
}
export const SlotEditBlockHeader = ({workingHours, setSelectedTimeSlotIds, setIsPrevDay}: Props) => {

    const handleSetAll = () => {
        const allTimeSlotIds = workingHours?.map(item => item.time_slot_id)
        setSelectedTimeSlotIds(allTimeSlotIds)
    }

    const handleClearAll = () => {
        setSelectedTimeSlotIds([])
    }

    const handleCopyPreviousDay = () => {
        setIsPrevDay(true)
    }

    return (
            <div className={styles.container}>
                <div className={styles.container_title}>
                    <div>
                        Повторить предыдущий:
                    </div>
                    <div
                        className={styles.container_title_link}
                        onClick={handleCopyPreviousDay}
                    >
                        день
                    </div>
                </div>
                <div className={styles.container_actions}>
                    <TextButton text={'Выделить все'} type={"primary"} action={handleSetAll}/>
                    /
                    <TextButton text={'Отменить все'} type={"primary"} action={handleClearAll}/>
                </div>
            </div>
    );
};
