import React, {memo, useMemo, useRef, useState} from "react";
import styles from "../SlotEditBlock/styles.module.scss";
import {WorkingHoursList} from "../../../../types/calendar.ts";
import {ReactMouseSelect, TFinishSelectionCallback} from "react-mouse-select";
import {TimeSlotContent} from "../TimeSlotContent";

type Props = {
    workingHours: WorkingHoursList[]
}

export const SlotEditBlockContent = memo(({ workingHours }: Props) => {
    const [selectedTimeSlotIds, setSelectedTimeSlotIds] = useState<number[]>([]);

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

    const finishSelection: TFinishSelectionCallback = (items) => {
        const selectedIds = items
            ?.map(item => parseInt(item.getAttribute('data-id') || ''))
            ?.filter(item => !isNaN(item));
        console.log(selectedIds, 'IDS')
        if (selectedIds.length > 0) {
            setSelectedTimeSlotIds(selectedIds);
        }
    }

    return (
        <div>
            <main
                className={styles.container_content}
                ref={containerRef}
                style={{padding: '40px'}}
            >
                {memoizedTimeSlots?.map(item =>
                        <TimeSlotContent
                            key={item?.time_slot_id}
                            timeSlot={item}
                            setSelectedTimeSlotIds={setSelectedTimeSlotIds}
                            selectedTimeSlotIds={selectedTimeSlotIds}
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
