import styles from './styles.module.scss'
import {IWorkScheduleCreate, IWorkScheduleUpdate, WorkSchedule} from "../../../types/calendar.ts";
import Slot from "../Slot/Slot.tsx";
import {memo, useState} from "react";
import {SlotDetails} from "../Slot/SlotDetails";
import CustomModal from "../../Shared/CustomModal/CustomModal.tsx";
import {useStateContext} from "../../../contexts";
import {formatDateToDayMonth} from "../../../utils/date/getDates.ts";
import {axiosInstance} from "../../../api";
import {useMutation, useQueryClient} from "@tanstack/react-query";

type Props = {
    slots: WorkSchedule[],
    doctorName: string,
    doctorId: number
}
const DoctorSlots = memo(({slots, doctorName, doctorId}: Props) => {

    const queryClient = useQueryClient()

    const {state, dispatch} = useStateContext()

    const {selectedTimeSlotIds, slot, addressId} = state

    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        mutateAsync: onCreateWorkSchedule,
        isPending: isCreateLoading,
        isSuccess: createSuccess
    } = useMutation({
        mutationKey: ['doctorTimeSlotDetailsCreate'],
        mutationFn: (body: IWorkScheduleCreate) =>
            axiosInstance.post(`partners/franchise-branches/${addressId}/doctors/${slot.doctorId}/work_schedule/${slot.workScheduleId}`, body),
    });

    const {
        mutate: onUpdateWorkSchedule,
        isPending: isUpdateLoading,
        isSuccess: updateSuccess
    } = useMutation({
        mutationKey: ['doctorTimeSlotDetailsUpdate'],
        mutationFn: (body: IWorkScheduleUpdate) => {
            return axiosInstance.put(`partners/franchise-branches/${addressId}/doctors/${slot.doctorId}/work_schedule/${slot.workScheduleId}`, body)
        },
        onSuccess: () => {
            setIsModalOpen(false)
            queryClient.invalidateQueries({queryKey: ['calendarData']})
        },
    });

    const {
        mutateAsync: onDeleteWorkSchedule,
    } = useMutation({
        mutationKey: ['doctorTimeSlotDetailsDelete'],
        mutationFn: () =>
            axiosInstance.delete(`partners/franchise-branches/${addressId}/doctors/${slot.doctorId}/work_schedule/${slot.workScheduleId}`),
    });

    const onSlotOpen = async (item: WorkSchedule) => {
        console.log(item, 'item')
        setIsModalOpen(true)
        const {doctor_work_schedule_object_id, work_date, panel_colour} = item

        if (panel_colour === 'white') {
            await onCreateWorkSchedule({
                work_date,
                working_hours: []
            })
        }

        dispatch({
            type: 'SET_SLOT_DATA',
            payload: {
                doctorId: doctorId,
                workScheduleId: doctor_work_schedule_object_id,
                title: `${doctorName}, ${formatDateToDayMonth(work_date ?? '')}`,
                panelColor: panel_colour
            }
        })

    }

    const handleConfirm = () => {
        const payload = selectedTimeSlotIds?.map(item => ({
            time_slot_id: item
        }))

        onUpdateWorkSchedule({
            working_hours: payload
        })

        setIsModalOpen(false);
    };

    const handleCloseModal = async () => {
        setIsModalOpen(false);
        if (slot.panelColor && !selectedTimeSlotIds.length) {
            await onDeleteWorkSchedule()
        }
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
                <SlotDetails isSuccess={createSuccess || updateSuccess} createLoading={isCreateLoading}/>
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
});

export default DoctorSlots;
