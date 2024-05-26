import styles from './styles.module.scss'
import {SlotEditBlock} from "../SlotEditBlock";
import {axiosInstance} from "../../../../api";
import {ITimeSlot} from "../../../../types/calendar.ts";
import {Spinner} from "../../../Shared/Spinner";
import {useQuery} from "@tanstack/react-query";

type Props = {
    doctorId: number,
    workScheduleId: number
}
export const SlotDetails = ({doctorId = 1794, workScheduleId = 60389}: Props) => {

    const addressId = 13

    const { data, isLoading } = useQuery({
        queryKey: ['doctorTimeSlotDetails', doctorId, addressId],
        queryFn: () =>
            axiosInstance
                .get<ITimeSlot>(`/partners/franchise-branches/${addressId}/doctors/${doctorId}/work_schedule/${workScheduleId}`)
                .then((response) => response?.data),
        enabled: !!addressId
    });

    if (isLoading) {
        return <Spinner/>
    }

    return (
        <div className={styles.container}>
            <SlotEditBlock workingHours={data?.doctor_work_schedule_detailed_api_view?.working_hours_list ?? []}/>
            <div style={{background: 'rgba(86,204,39,0.17)', height: '100%', width: '400px'}}>
                Тут будет какая то информация
            </div>
        </div>
    );
};
