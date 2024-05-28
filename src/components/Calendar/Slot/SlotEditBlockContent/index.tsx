import {memo, useEffect, useMemo, useRef, useState} from "react";
import {Box, boxesIntersect, useSelectionContainer} from "@air/react-drag-to-select";
import styles from "../SlotEditBlock/styles.module.scss";
import {TimeSlotContent} from "../TimeSlotContent";
import {WorkingHoursList} from "../../../../types/calendar.ts";

type Props = {
    workingHours: WorkingHoursList[]
}

export const SlotEditBlockContent = memo(({ workingHours }: Props) => {
    const [selectedTimeSlotIds, setSelectedTimeSlotIds] = useState<Set<number>>(new Set());
    const selectableItems = useRef<Box[]>([]);
    const elementsContainerRef = useRef<HTMLDivElement | null>(null);

    const formatWorkingHours = () => {
        return workingHours.map((item) => ({
            ...item,
            isActive: selectedTimeSlotIds.has(item.time_slot_id)
        }));
    };

    const memoizedTimeSlots = useMemo(
        formatWorkingHours,
        [selectedTimeSlotIds]
    );

    const { DragSelection } = useSelectionContainer({
        // @ts-ignore
        eventsElement: document,
        onSelectionChange: (box) => {
            const scrollAwareBox: Box = {
                ...box,
                top: box.top + window.scrollY,
                left: box.left + window.scrollX
            };
            const indexesToSelect: number[] = [];
            selectableItems.current.forEach((item, index) => {
                if (boxesIntersect(scrollAwareBox, item)) {
                    const selectedId = memoizedTimeSlots[index]?.time_slot_id;
                    const isAvailable = memoizedTimeSlots[index]?.doctor_availability;
                    if (isAvailable) {
                        indexesToSelect.push(selectedId);
                    }
                }
            });

            setSelectedTimeSlotIds(prevState => {
                const newState = new Set(prevState);
                indexesToSelect.forEach(id => newState.add(id));
                return newState;
            });
        },
        onSelectionStart: () => {
            console.log("OnSelectionStart");
        },
        onSelectionEnd: () => console.log("OnSelectionEnd"),
        selectionProps: {
            style: {
                border: "2px dashed purple",
                borderRadius: 4,
                backgroundColor: "brown",
                opacity: 0.5
            }
        },
        isEnabled: true
    });

    useEffect(() => {
        if (elementsContainerRef.current) {
            Array.from(elementsContainerRef.current.children).forEach((item) => {
                const { left, top, width, height } = item.getBoundingClientRect();
                selectableItems.current.push({
                    left,
                    top,
                    width,
                    height
                });
            });
        }
    }, []);

    useEffect(() => {
        if (workingHours.length) {
            const reservedItems = workingHours.filter(item => item.reserved).map(item => item.time_slot_id);
            setSelectedTimeSlotIds(prevState => {
                const newState = new Set(prevState);
                reservedItems.forEach(id => newState.add(id));
                return newState;
            });
        }
    }, [workingHours]);

    return (
        <div>
            <DragSelection />
            <div
                className={styles.container_content}
                ref={elementsContainerRef}
            >
                {memoizedTimeSlots?.map(item =>
                    <TimeSlotContent
                        key={item?.time_slot_id}
                        timeSlot={item}
                        setSelectedTimeSlotIds={setSelectedTimeSlotIds}
                        selectedTimeSlotIds={selectedTimeSlotIds}
                    />
                )}
            </div>
        </div>
    );
});
