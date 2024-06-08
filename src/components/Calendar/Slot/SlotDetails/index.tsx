import styles from './styles.module.scss'
import {SlotEditBlock} from "../SlotEditBlock";
import {axiosInstance} from "../../../../api";
import {ITimeSlot} from "../../../../types/calendar.ts";
import {Spinner} from "../../../Shared/Spinner";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useStateContext} from "../../../../contexts";
import {SlotAdditionalInfoBlock} from "../SlotAdditionalInfoBlock";
import {isMonday} from "../../../../utils/date/getDates.ts";
import {customNotification} from "../../../../utils/customNotification.ts";

export const SlotDetails = () => {

    const {state} = useStateContext()

    const {addressId, slot} = state

    const {doctorId, workScheduleId} = slot

    const { data, isLoading } = useQuery({
        queryKey: ['doctorTimeSlotDetails', doctorId, addressId, workScheduleId],
        queryFn: () =>
            axiosInstance
                .get<ITimeSlot>(`/partners/franchise-branches/${addressId}/doctors/${doctorId}/work_schedule/${workScheduleId}`)
                .then((response) => response?.data),
        enabled: !!addressId && !!doctorId && !!workScheduleId
    });

    const {
        mutate: onGetPrevWorkSchedule,
        isPending: isUpdateLoading,
    } = useMutation({
        mutationKey: ['previousDoctorTimeSlotDetails'],
        mutationFn: () =>
            axiosInstance.get(`/partners/franchise-branches/${addressId}/doctors/${doctorId}/work_schedule/${workScheduleId}`),
    });

    const handleCopyPreviousDay = async () => {
        if (isMonday()) {
            customNotification({
                type: 'warning',
                message: 'Предыдущий день был выходным, и в этот день у врача не было рабочих часов.'
            })
        } else {
            const data = await onGetPrevWorkSchedule()
            console.log(data)
        }


    }

    if (isLoading) {
        return  <div className={styles.loader}>
            <Spinner/>
        </div>

    }

    return (
        <div className={styles.container}>
            <SlotEditBlock
                workingHours={data?.doctor_work_schedule_detailed_api_view?.working_hours_list ?? []}
                handleCopyPreviousDay={handleCopyPreviousDay}
                isLoading={isUpdateLoading}
            />
            <SlotAdditionalInfoBlock slotInfoData={data?.doctor_work_schedule_detailed_api_view}/>
        </div>
    );
};
