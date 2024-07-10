import styles from './styles.module.scss'
import CalendarContent from "../../components/Calendar/CalendarContent/CalendarContent.tsx";
import Filters from "../../components/Calendar/Filters/Filters.tsx";
import {useMemo, useState} from "react";
import {getDateRange} from "../../utils/date/getDates.ts";
import {axiosInstance} from "../../api";
import {IGet} from "../../types/common.ts";
import {ICalendar} from "../../types/calendar.ts";
import {objectToQueryParams} from "../../utils/objectToQueryParams.ts";
import {useStateContext} from "../../contexts";
import {useQuery} from "@tanstack/react-query";

const CalendarPage = () => {

    const {state} = useStateContext()

    const {addressId, searchQuery} = state

    const [page, setPage] = useState(1)

    const searchDates = useMemo(() => getDateRange(state?.page), [state?.page])

    const { data, isFetching: isLoading } = useQuery({
        queryKey: ['calendarData', searchDates, addressId, page, searchQuery],
        queryFn: () =>
            axiosInstance
                .get<IGet<ICalendar>>(`partners/franchise-branches/${addressId}/schedule/${searchDates}?page=${page}&page_size=10&${objectToQueryParams({
                    part_of_name: searchQuery
                })}`)
                .then((response) => response?.data),
        enabled: !!addressId
    });

    return (
        <div className={styles.container}>
            <Filters setPage={setPage} total={data?.count ?? 0}/>
            <CalendarContent isLoading={isLoading} data={data?.results ?? []}/>
        </div>
    );
};

export default CalendarPage;
