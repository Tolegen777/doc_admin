import styles from './styles.module.scss'
import {axiosInstance} from "../../../api";
import { useQuery } from '@tanstack/react-query';
import {ICalendar} from "../../../types/calendar.ts";
import DoctorTitle from "../DoctorTitle/DoctorTitle.tsx";
import DoctorSlots from "../DoctorSlots/DoctorSlots.tsx";
import {getDateRange, getDates} from "../../../utils/date/getDates.ts";
import DateSlots from "../DateSlots/DateSlots.tsx";
import {useStateContext} from "../../../contexts";
import {useState} from "react";
import {FullSpinner} from "../../Shared/FullSpinner";
import {IGet} from "../../../types/common.ts";
import {useInfiniteScroll} from "../../../hooks/useInfiniteScroll.ts";
import InfiniteScrollingContentWrapper from "../../Shared/InfiniteScrollingContentWrapper";
import InfiniteScrollLoader from "../../Shared/InfiniteScrollLoader";

const CalendarContent = () => {

    const {state} = useStateContext()

    const {page, addressId} = state

    const [currentPage, setCurrentPage] = useState(1)

    const searchDates = getDateRange(page)

    const { data, isLoading } = useQuery({
        queryKey: ['calendarData', searchDates, addressId, currentPage],
        queryFn: () =>
            axiosInstance
                .get<IGet<ICalendar>>(`partners/franchise-branches/${addressId}/schedule/${searchDates}?page=${currentPage}&page_size=20`)
                .then((response) => response?.data),
        enabled: !!addressId
    });

    const { localData, scrollContainerRef } = useInfiniteScroll({
        data: data ?? null,
        setPage: setCurrentPage,
        page: currentPage,
    });

    const dates = getDates(page)

    if (isLoading && !localData?.length) {
        return <FullSpinner />
    }

    return (
        <div className={styles.container}>
            <InfiniteScrollingContentWrapper scrollContainerRef={scrollContainerRef}>
                <div className={styles.container_content}>
                    <DoctorTitle doctor={''} isEmpty={true}/>
                    <DateSlots dates={dates ?? []}/>
                </div>
                {
                    localData?.map((item, index) => <div className={styles.container_content} key={index}>
                        <DoctorTitle doctor={item?.doctor ?? ''} count={index + 1}/>
                        <DoctorSlots slots={item?.work_schedule ?? []} doctorName={item?.doctor ?? ''}/>
                    </div>)
                }
                {isLoading && <InfiniteScrollLoader />}
            </InfiniteScrollingContentWrapper>
        </div>
    );
};

export default CalendarContent;
