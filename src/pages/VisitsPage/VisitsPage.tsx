import styles from './styles.module.scss'
import {CustomTable} from "../../components/Shared/CustomTable";
import {useQuery} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {useStateContext} from "../../contexts";
import {IVisit} from "../../types/visits.ts";
import {formatDateTime} from "../../utils/date/getDates.ts";
import {DoctorProfile} from "../../components/Doctors/DoctorProfile/DoctorProfile.tsx";
import {IGet} from "../../types/common.ts";
import {objectToQueryParams} from "../../utils/objectToQueryParams.ts";
import {useState} from "react";

const VisitsPage = () => {

    const {state} = useStateContext()

    const {addressId, visitsQuery} = state

    const [page, setPage] = useState(1)

    const columns = [
        {
            title: 'Дата визита',
            key: 'date',
            render: (visit: IVisit) => <p>{formatDateTime({
                inputDate: visit?.date,
                inputTime: visit?.visit_time_slot
            })}</p>
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
            key: 'status',
            render: (status: any) => (
                <div>
                    <div>{status?.status?.status_title}</div>
                    {/*<TextButton text={'Изменить'} type={'primary'} action={() => {}} />*/}
                </div>

            ),
        },
        {
            title: 'Пациент',
            key: 'patient_full_name',
            render: (visit: IVisit) => {
                    return <div>
                        <div>{visit?.patient_full_name}</div>
                        <div>{visit?.patient_phone_number}</div>
                        <div>{visit?.patient_iin_number}</div>
                    </div>
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
        queryKey: ['visitsData', addressId, visitsQuery, page],
        queryFn: () =>
            axiosInstance
                .get<IGet<IVisit>>(`partners/franchise-branches/${addressId}/visits/?page=${page}&${objectToQueryParams({
                    part_of_name: visitsQuery
                })}`)
                .then((response) => response?.data),
        enabled: !!addressId
    });

    return (
        <div className={styles.container}>
            {/*<Filters/>*/}
            <CustomTable
                columns={columns}
                dataSource={data?.results}
                loading={isLoading}
                setPage={setPage}
                total={data?.count ?? 0}
                current={page}
            />
        </div>
    );
};

export default VisitsPage;
