import styles from './styles.module.scss'
import {axiosInstance} from "../../../api";
import { useQuery } from '@tanstack/react-query';
import {ICalendar} from "../../../types/calendar.ts";
import DoctorTitle from "../DoctorTitle/DoctorTitle.tsx";
import DoctorSlots from "../DoctorSlots/DoctorSlots.tsx";
import {getDateRange, getDates} from "../../../utils/date/getDates.ts";
import DateSlots from "../DateSlots/DateSlots.tsx";
import {useStateContext} from "../../../contexts";
import {useMemo} from "react";
import {FullSpinner} from "../../Shared/FullSpinner";
import {IGet} from "../../../types/common.ts";

const CalendarContent = () => {

    const {state} = useStateContext()

    const {page, searchQuery, addressId} = state

    const searchDates = getDateRange(page)

    const { data, isLoading } = useQuery({
        queryKey: ['calendarData', searchDates, addressId],
        queryFn: () =>
            axiosInstance
                .get<IGet<ICalendar>>(`partners/franchise-branches/${addressId}/schedule/2024-05-25/2024-05-30/`)
                .then((response) => response?.data),
        enabled: !!addressId
    });

    const dates = getDates(page)

    const filterDataByQuery = (): ICalendar[] => {
        if (data) {
            if (searchQuery?.length) {
                return data?.results?.filter(item => item.doctor.includes(searchQuery))
            } else {
                return data?.results
            }
        }
        return []
    }

    const filteredDate = useMemo(() => {
        return filterDataByQuery()
    }, [searchQuery, data])

    if (isLoading) {
        return <FullSpinner />
    }

    return (
        <div className={styles.container}>
            <div className={styles.container_content}>
                <DoctorTitle doctor={''} isEmpty={true}/>
                <DateSlots dates={dates ?? []}/>
            </div>
            {
                filteredDate?.map((item, index) => <div className={styles.container_content} key={index}>
                    <DoctorTitle doctor={item?.doctor ?? ''} count={index + 1}/>
                    <DoctorSlots slots={item?.work_schedule ?? []} doctorName={item?.doctor ?? ''}/>
                </div>)
            }
        </div>
    );
};

export default CalendarContent;
