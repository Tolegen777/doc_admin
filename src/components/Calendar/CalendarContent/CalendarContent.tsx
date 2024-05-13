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
import {Spin} from "antd";

const CalendarContent = () => {

    const {state} = useStateContext()

    const {searchQuery} = state

    const {page} = state

    const searchDates = getDateRange(page)

    const { data, isLoading } = useQuery({
        queryKey: ['calendarData', searchDates],
        queryFn: () =>
            axiosInstance
                .get<ICalendar[]>(`partners/franchise-branches/90/schedule/${searchDates}`)
                .then((response) => response?.data),
    });

    const dates = getDates(page)

    const filterDataByQuery = (): ICalendar[] => {
        if (data) {
            if (searchQuery?.length) {
                return data.filter(item => item.doctor.includes(searchQuery))
            } else {
                return data
            }
        }
        return []
    }

    const filteredDate = useMemo(() => {
        return filterDataByQuery()
    }, [searchQuery, data])

    if (isLoading) {
        return <Spin fullscreen/>
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
                    <DoctorSlots slots={item?.work_schedule ?? []}/>
                </div>)
            }
        </div>
    );
};

export default CalendarContent;
