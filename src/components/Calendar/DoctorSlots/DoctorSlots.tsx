import styles from './styles.module.scss'
import {WorkSchedule} from "../../../types/calendar.ts";
import Slot from "../Slot/Slot.tsx";
import {useState} from "react";
import {SlotDetails} from "../Slot/SlotDetails";
import CustomModal from "../../Shared/CustomModal/CustomModal.tsx";

type Props = {
    slots: WorkSchedule[]
}
const DoctorSlots = ({slots}: Props) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const onSlotOpen = (item: WorkSchedule) => {
        console.log(item)
        setIsModalOpen(true)
    }

    const handleConfirm = () => {
        setIsModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <CustomModal isOpen={isModalOpen} onClose={handleCloseModal} onConfirm={handleConfirm}>
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
