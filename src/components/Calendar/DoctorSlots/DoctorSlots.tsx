import styles from './styles.module.scss'
import {IWorkScheduleUpdate, WorkSchedule} from "../../../types/calendar.ts";
import Slot from "../Slot/Slot.tsx";
import {useState} from "react";
import {SlotDetails} from "../Slot/SlotDetails";
import CustomModal from "../../Shared/CustomModal/CustomModal.tsx";
import {useStateContext} from "../../../contexts";
import {formatDateToDayMonth} from "../../../utils/date/getDates.ts";
import {axiosInstance} from "../../../api";
import {useMutation} from "@tanstack/react-query";
import {ActionType} from "../../../types/common.ts";

type Props = {
    slots: WorkSchedule[],
    doctorName: string
}
const DoctorSlots = ({slots, doctorName}: Props) => {

    const {state, dispatch} = useStateContext()

    const {selectedTimeSlotIds} = state

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [actionType, setActionType] = useState<ActionType>('');

    const {
        mutate: onCreateWorkSchedule,
        isPending: isCreateLoading,
    } = useMutation({
        mutationKey: ['doctorTimeSlotDetails'],
        mutationFn: (body: IWorkScheduleUpdate[]) =>
            axiosInstance.post('/users/profile/', body),
        onSuccess: (response: any) => {
            console.log(response, 'RESPONSE');
            setIsModalOpen(true)
        },
    });

    const {
        mutate: onUpdateWorkSchedule,
        isPending: isUpdateLoading,
    } = useMutation({
        mutationKey: ['doctorTimeSlotDetails'],
        mutationFn: (body: IWorkScheduleUpdate[]) =>
            axiosInstance.put('/users/profile/', body),
        onSuccess: (response: any) => {
            console.log(response, 'RESPONSE');
            setIsModalOpen(true)
        },
    });

    const onSlotOpen = (item: WorkSchedule) => {
        console.log(item)
        setIsModalOpen(true)
        const {doctor_work_schedule_object_id, doctor_id, work_date, panel_colour} = item

        if (panel_colour === 'white') {
            setActionType('create')
        } else {
            setActionType('update')
        }

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
        const payload = selectedTimeSlotIds?.map(item => ({
            time_slot_id: item
        }))
        if (actionType === 'create') {
            onCreateWorkSchedule(payload)
        } else {
            onUpdateWorkSchedule(payload)
        }
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
                isLoading={isUpdateLoading || isCreateLoading}
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
