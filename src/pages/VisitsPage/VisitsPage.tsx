import styles from './styles.module.scss'
import {CustomTable} from "../../components/Shared/CustomTable";
import {useQuery} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {useStateContext} from "../../contexts";
import {addCountsToData} from "../../utils/addCountsToData.ts";
import {useMemo} from "react";
import {Button, Typography} from 'antd'
import {IVisit} from "../../types/visits.ts";
import Filters from "../../components/Visits/Filters/Filters.tsx";
import {formatDateTime} from "../../utils/date/getDates.ts";

const VisitsPage = () => {

    const {state} = useStateContext()

    const {addressId, visitsQuery} = state

    const columns = [
        {
            title: 'Дата визита',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Врач',
            key: 'doctor_full_name',
            render: (visit: IVisit) => <Typography.Title style={{fontSize: 15}}>{visit.doctor_full_name}</Typography.Title>
        },
        {
            title: 'Статус',
            key: 'visit_status',
            dataIndex: 'visit_status',
            render: (status: string) => (
                <div>
                   <div>{status}</div>
                   <Button type={'text'}>Изменить</Button>
                </div>

            ),
        },
        {
            title: 'Пациент',
            key: 'patient_full_name',
            render: (visit: IVisit) => {
                if (visit.patient_id) {return <div>
                   <div>{visit?.patient_full_name}</div>
                   <div>{visit?.patient_phone_number}</div>
                   <div>{visit?.patient_iin_number}</div>
                </div>} else {
                    return <Button>Показать информацию</Button>
                }

            },
        },
        {
            title: 'Дата создания/обновления',
            key: 'visit_time_slot',
            render: (visit: IVisit) => <p>{formatDateTime(visit?.date, visit?.visit_time_slot)}</p>
        },
    ];

    const { data, isLoading } = useQuery({
        queryKey: ['visitsData', addressId],
        queryFn: () =>
            axiosInstance
                .get<IVisit[]>(`partners/franchise-branches/${addressId}/visits/`)
                .then((response) => response?.data),
        enabled: !!addressId
    });

    function filterByQueryAndSpecialities() {
        return data?.filter(item => {
            return visitsQuery === '' ||
                item.doctor_full_name.toLowerCase().includes(visitsQuery.toLowerCase()) ||
                item.procedure_title.toLowerCase().includes(visitsQuery.toLowerCase());
        });
    }

    const filteredData = useMemo(filterByQueryAndSpecialities, [visitsQuery, data])

    return (
        <div className={styles.container}>
            <Filters/>
            <CustomTable
                columns={columns}
                dataSource={addCountsToData(filteredData ?? [])}
                loading={isLoading}
            />
        </div>
    );
};

export default VisitsPage;
