import styles from './styles.module.scss'
import {WorkSchedule} from "../../../types/calendar.ts";
import Slot from "../Slot/Slot.tsx";
import {useState} from "react";
import {SlotDetails} from "../Slot/SlotDetails";
import CustomModal from "../../Shared/CustomModal/CustomModal.tsx";
import {useStateContext} from "../../../contexts";
import {formatDateToDayMonth} from "../../../utils/date/getDates.ts";

type Props = {
    slots: WorkSchedule[],
    doctorName: string
}
const DoctorSlots = ({slots, doctorName}: Props) => {

    const {state, dispatch} = useStateContext()

    const [isModalOpen, setIsModalOpen] = useState(false);

    const onSlotOpen = (item: WorkSchedule) => {
        console.log(item)
        setIsModalOpen(true)
        const {doctor_work_schedule_object_id, doctor_id, work_date} = item
        dispatch({
            type: 'SET_SLOT_DATA',
            payload: {
                doctorId: doctor_id,
                workScheduleId: doctor_work_schedule_object_id,
                title: `${doctorName}, ${formatDateToDayMonth(work_date ?? '')}`
            }
        })

    }

    const handleConfirm = () => {
        setIsModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <CustomModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirm}
                title={state?.slot?.title ?? ''}
            >
                <SlotDetails/>
            </CustomModal>
            <div className={styles.container}>
                {slots?.map((item, index) => <Slot
                    key={index}
                    panelColour={item?.panel_colour}
                    workingHoursCount={item?.working_hours_count}
                    visitsCount={item?.visits_count}
                    onSlotOpen={() => onSlotOpen(item)}
                />)}
            </div>
        </>
    );
};

export default DoctorSlots;
