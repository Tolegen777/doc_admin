import {memo, useEffect, useMemo, useRef} from "react";
import styles from "./styles.module.scss";
import {WorkingHoursList} from "../../../../types/calendar.ts";
import {ReactMouseSelect, TFinishSelectionCallback} from "react-mouse-select";
import {TimeSlotContent} from "../TimeSlotContent";
import {useStateContext} from "../../../../contexts";

type Props = {
    workingHours: WorkingHoursList[],
}

export const SlotEditBlockContent = memo(({ workingHours }: Props) => {

    const {state, dispatch} = useStateContext()

    const {selectedTimeSlotIds} = state

    const borderSelectionContainer = document.getElementById('root') as HTMLElement;
    const containerRef = useRef<HTMLElement>(null);

    const formatWorkingHours = () => {
        return workingHours.map((item) => ({
            ...item,
            isActive: selectedTimeSlotIds.includes(item.time_slot_id)
        }));
    };

    const memoizedTimeSlots = useMemo(
        formatWorkingHours,
        [selectedTimeSlotIds]
    );

    useEffect(() => {
        const reservedWorkingHours = workingHours.filter(item => item?.reserved)?.map(item => item?.time_slot_id)
        dispatch({
            type: 'SET_SELECTED_TIME_SLOTS_IDS',
            payload: reservedWorkingHours ?? []
        })
    }, [workingHours])

    const finishSelection: TFinishSelectionCallback = (items) => {
        const selectedIds = items
            ?.map(item => parseInt(item.getAttribute('data-id') || ''))
            ?.filter(item => !isNaN(item));
        if (selectedIds.length > 0) {
            dispatch({
                type: 'ADD_SELECTED_TIME_SLOTS_IDS',
                payload: selectedIds
            })
        }
    }

    return (
        <div className={styles.container}>
            <main
                className={styles.container_content}
                ref={containerRef}
            >
                {memoizedTimeSlots?.map(item =>
                        <TimeSlotContent
                            key={item?.time_slot_id}
                            timeSlot={item}
                        />
                )}
            </main>
            <ReactMouseSelect
                containerRef={containerRef}
                portalContainer={borderSelectionContainer}
                itemClassName="mouse-select__selectable"
                sensitivity={10}
                tolerance={5}
                notStartWithSelectableElements={false}
                finishSelectionCallback={finishSelection}
            />
        </div>
    );
});
