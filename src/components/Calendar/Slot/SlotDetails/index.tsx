import styles from './styles.module.scss'
import {SlotEditBlock} from "../SlotEditBlock";
import {axiosInstance} from "../../../../api";
import {ITime, ITimeSlot, WorkingHoursList} from "../../../../types/calendar.ts";
import {Spinner} from "../../../Shared/Spinner";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useStateContext} from "../../../../contexts";
import {SlotAdditionalInfoBlock} from "../SlotAdditionalInfoBlock";
import {getPreviousDate} from "../../../../utils/date/getDates.ts";
import {customNotification} from "../../../../utils/customNotification.ts";
import {AxiosResponse} from "axios";
import {ActionType} from "../../../../types/common.ts";
import {useMemo} from "react";

type Props = {
    isSuccess: boolean,
    createLoading: boolean,
    actionType: ActionType,
    times: ITime[]
}

export const SlotDetails = ({isSuccess, createLoading, actionType, times}: Props) => {

    const {state, dispatch} = useStateContext()

    const {addressId, slot} = state

    const {doctorId, workScheduleId} = slot

    const { data, isLoading } = useQuery({
        queryKey: ['doctorTimeSlotDetails', doctorId, addressId, workScheduleId, isSuccess],
        queryFn: () =>
            axiosInstance
                .get<ITimeSlot>(`/partners/franchise-branches/${addressId}/doctors/${doctorId}/work_schedule/${workScheduleId}`)
                .then((response) => response?.data),
        enabled: !!addressId && !!doctorId && !!workScheduleId
    });

    const {
        isPending: isUpdateLoading,
        mutateAsync: onGetPrevWorkSchedule
    } = useMutation({
        mutationKey: ['previousDoctorTimeSlotDetails'],
        mutationFn: (date: string) =>
            axiosInstance.get(`/partners/franchise-branches/${addressId}/doctors/${doctorId}/work_schedule_by_date/${date}`),
    });

    const formattedWorkingHours: WorkingHoursList[] = useMemo(() => {
        if (actionType === 'create') {
            return times?.map(item => ({
                ...item,
            doctor_availability: false,
            panel_colour: "empty_blue",
            patient_clinic_visit_id: undefined,
            reserved: false,
            }))
        }
        return []
    }, [actionType])

    const handleCopyPreviousDay = async () => {
        const prevDate = getPreviousDate(data?.doctor_work_schedule_detailed_api_view?.work_date ?? '')
        if (prevDate === 'weekend') {
            customNotification({
                type: 'warning',
                message: 'Предыдущий день был выходным, и в этот день у врача не было рабочих часов.'
            })
        } else {
            const data: AxiosResponse<ITimeSlot> = await onGetPrevWorkSchedule(prevDate)
            const workingHours = data?.data?.doctor_work_schedule_detailed_api_view?.working_hours_list
            const activeSlotIds = workingHours?.filter(item => item?.panel_colour === 'full_blue')?.map(item => item?.time_slot_id)
            dispatch({
                type: 'SET_SELECTED_TIME_SLOTS_IDS',
                payload: activeSlotIds
            })
        }
    }

    if (isLoading || createLoading) {
        return  <div className={styles.loader}>
            <Spinner/>
        </div>

    }

    const workingHours = actionType === 'update' ? data?.doctor_work_schedule_detailed_api_view?.working_hours_list : formattedWorkingHours

    return (
        <div className={styles.container}>
            <SlotEditBlock
                workingHours={workingHours ?? []}
                handleCopyPreviousDay={handleCopyPreviousDay}
                isLoading={isUpdateLoading}
            />
            <SlotAdditionalInfoBlock slotInfoData={data?.doctor_work_schedule_detailed_api_view}/>
        </div>
    );
};
