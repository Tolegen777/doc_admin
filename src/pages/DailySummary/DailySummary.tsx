import styles from './styles.module.scss'
import {CustomTable} from "../../components/Shared/CustomTable";
import {useQuery} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {useStateContext} from "../../contexts";
import {addCountsToData} from "../../utils/addCountsToData.ts";
import {useMemo} from "react";
import {Button} from 'antd'
import {IVisit} from "../../types/visits.ts";
import Filters from "../../components/Visits/Filters/Filters.tsx";
import {formatDateTime} from "../../utils/date/getDates.ts";
import {TextButton} from "../../components/Shared/Buttons/TextButton";
import {DoctorProfile} from "../../components/Doctors/DoctorProfile/DoctorProfile.tsx";
import {IGet} from "../../types/common.ts";
import {IDailySummary} from "../../types/dailySummary.ts";

const DailySummary = () => {

    const {state} = useStateContext()

    const {addressId, visitsQuery} = state

    const columns = [
        {
            title: 'Дата визита',
            key: 'date',
            render: (visit: IVisit) => !visit?.date ? <p>{formatDateTime({
                inputDate: visit?.date,
                inputTime: visit?.visit_time_slot
            })}</p> : <TextButton text={'Новая заявка'} type={'primary'} action={() => {}} />
        },
        {
            title: 'Врач',
            key: 'doctor_full_name',
            render: (visit: IVisit) => <DoctorProfile
                title={visit?.doctor_full_name}
                subTitle={visit?.procedure_title}
                imgSrc={''}
            />
        },
        {
            title: 'Статус',
            key: 'visit_status',
            dataIndex: 'visit_status',
            render: (status: string) => (
                <div>
                    <div>{status}</div>
                    <TextButton text={'Изменить'} type={'primary'} action={() => {}} />
                </div>

            ),
        },
        {
            title: 'Пациент',
            key: 'patient_full_name',
            render: (visit: IVisit) => {
                if (!visit.patient_id) {
                    return <div>
                        <div>{visit?.patient_full_name}</div>
                        <div>{visit?.patient_phone_number}</div>
                        <div>{visit?.patient_iin_number}</div>
                    </div>
                } else {
                    return <Button type="primary" ghost>Показать информацию</Button>
                }

            },
        },
        {
            title: 'Дата создания/обновления',
            key: 'visit_time_slot',
            render: (visit: IVisit) => <div>
                <p>
                    {formatDateTime({
                        isoDateTime: visit?.created_at
                    })}
                </p>
                {visit?.updated_at?.length > 0 && <p>
                    Изменено: {formatDateTime({
                        isoDateTime: visit?.updated_at
                    })}
                </p>}
            </div>
        },
    ];

    const {data, isLoading} = useQuery({
        queryKey: ['dailySummaryData', addressId],
        queryFn: () =>
            axiosInstance
                .get<IGet<IDailySummary>>(`partners/franchise-branches/${addressId}/daily-summary/`)
                .then((response) => response?.data),
        enabled: !!addressId
    });

    function filterByQueryAndSpecialities() {
        return data?.results?.filter(item => {
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

export default DailySummary;
