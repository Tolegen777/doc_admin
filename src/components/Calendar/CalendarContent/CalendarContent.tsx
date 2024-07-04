import styles from './styles.module.scss'
import {ICalendar} from "../../../types/calendar.ts";
import DoctorTitle from "../DoctorTitle/DoctorTitle.tsx";
import DoctorSlots from "../DoctorSlots/DoctorSlots.tsx";
import {getDates} from "../../../utils/date/getDates.ts";
import DateSlots from "../DateSlots/DateSlots.tsx";
import {useMemo} from "react";
import {FullSpinner} from "../../Shared/FullSpinner";
import {useStateContext} from "../../../contexts";

type Props = {
    isLoading: boolean,
    data: ICalendar[]
}
const CalendarContent = ({isLoading, data}: Props) => {

    const {state} = useStateContext()

    const {page} = state

    const dates = useMemo(() => getDates(page), [page])

    if (isLoading) {
        return <FullSpinner/>
    }

    return (
        <div className={styles.container}>
            <div className={styles.container_content}>
                <DoctorTitle doctor={''} isEmpty={true}/>
                <DateSlots dates={dates ?? []}/>
            </div>
            {
                data?.map((item, index) => <div className={styles.container_content} key={index}>
                    <DoctorTitle doctor={item?.doctor_profile_full_name ?? ''} count={index + 1}/>
                    <DoctorSlots
                        slots={item?.work_schedule_data ?? []}
                        doctorName={item?.doctor_profile_full_name ?? ''}
                        doctorId={item?.doctor_profile_id}
                    />
                </div>)
            }
        </div>
    );
};

export default CalendarContent;
