import styles from './styles.module.scss'
import {CustomTable} from "../../components/Shared/CustomTable";
import {useQuery} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {useStateContext} from "../../contexts";
import {useParams} from "react-router-dom";
import {useState} from "react";
import {IGetMonthlySummariesById} from "../../types/monthSummaryById.ts";
import {formatDate} from "../../utils/date/getDates.ts";

const MonthSummaryByIdPage = () => {

    const {state} = useStateContext()

    const {addressId} = state

    const [page, setPage] = useState(1)

    const params = useParams()

    const columns = [
        {
            title: 'Одобрен',
            key: 'approved',
            dataIndex: 'approved',
            render: (item: boolean) => <div>{item ? 'Да' : 'Нет'}</div>
        },
        {
            title: 'Подтверждено',
            key: 'approved_by_clinic',
            dataIndex: 'approved_by_clinic',
            render: (item: boolean) => <div>{item ? 'Да' : 'Нет'}</div>
        },
        {
            title: 'Название филиала клиники',
            key: 'clinic_branch_title',
            dataIndex: 'clinic_branch_title',
        },
        {
            title: 'Дата создания',
            key: 'created_at',
            dataIndex: 'created_at',
            render: (item: string) => <div>{formatDate(item)}</div>
        },
        {
            title: 'Дата визита',
            key: 'date',
            dataIndex: 'date',
        },
        {
            title: 'ФИО врача',
            key: 'doctor_full_name',
            dataIndex: 'doctor_full_name',
        },
        {
            title: 'Детский визит',
            key: 'is_child',
            dataIndex: 'is_child',
            render: (item: boolean) => <div>{item ? 'Да' : 'Нет'}</div>
        },
        {
            title: 'Оплачен',
            key: 'paid',
            dataIndex: 'paid',
            render: (item: boolean) => <div>{item ? 'Да' : 'Нет'}</div>
        },
        {
            title: 'Дата рождения пациента',
            key: 'patient_birth_date',
            dataIndex: 'patient_birth_date',
        },
        {
            title: 'ФИО пациента',
            key: 'patient_full_name',
            dataIndex: 'patient_full_name',
        },
        {
            title: 'ИИН пациента',
            key: 'patient_iin_number',
            dataIndex: 'patient_iin_number',
        },
        {
            title: 'Телефон пациента',
            key: 'patient_phone_number',
            dataIndex: 'patient_phone_number',
        },
        {
            title: 'Название процедуры',
            key: 'procedure_title',
            dataIndex: 'procedure_title',
        },
        {
            title: 'Статус',
            key: 'status',
            dataIndex: 'status',
        },
        {
            title: 'Дата обновления',
            key: 'updated_at',
            dataIndex: 'updated_at',
        },
        {
            title: 'Цена визита',
            key: 'visit_price',
            dataIndex: 'visit_price',
        },
        {
            title: 'Время визита',
            key: 'visit_time_slot',
            dataIndex: 'visit_time_slot',
        },
        {
            title: 'Заметка',
            key: 'note',
            dataIndex: 'note',
        },
    ];




    const {data, isLoading} = useQuery({
        queryKey: ['monthSummaryByIdData', addressId, params?.id, page],
        queryFn: () =>
            axiosInstance
                .get<IGetMonthlySummariesById>(`employee_endpoints/clinics/${addressId}/monthly-summaries/${params?.id}`)
                .then((response) => response?.data),
        enabled: !!addressId
    });

    return (
        <div className={styles.container}>
            <CustomTable
                columns={columns}
                dataSource={data?.results?.visits ?? []}
                loading={isLoading}
                setPage={setPage}
                current={page}
                total={data?.count ?? 0}
            />
        </div>
    );
};

export default MonthSummaryByIdPage;
