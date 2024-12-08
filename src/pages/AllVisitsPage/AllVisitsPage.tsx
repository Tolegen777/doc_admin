// VisitsPage.tsx
import {CustomTable} from "../../components/Shared/CustomTable";
import {useQuery} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {useState} from "react";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";
import styles from './styles.module.scss';

interface IVisit {
    id: number;
    date: string;
    visit_time_slot: string;
    clinic_branch_title: string;
    doctor_full_name: string;
    procedure_title: string;
    patient_full_name: string;
    patient_id: number;
    status_title: string;
    created_at: string;
    updated_at: string;
}

export const AllVisitsPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['visitsData', page],
        queryFn: () =>
            axiosInstance
                .get(`partners/franchise-info/all-visits/?page=${page}`)
                .then((response) => response.data),
    });

    const columns = [
        {
            title: 'Дата визита',
            key: 'date',
            dataIndex: 'date',
        },
        {
            title: 'Время',
            key: 'visit_time_slot',
            dataIndex: 'visit_time_slot',
        },
        {
            title: 'Филиал клиники',
            key: 'clinic_branch_title',
            dataIndex: 'clinic_branch_title',
        },
        {
            title: 'Врач',
            key: 'doctor_full_name',
            dataIndex: 'doctor_full_name',
        },
        {
            title: 'Процедура',
            key: 'procedure_title',
            dataIndex: 'procedure_title',
        },
        {
            title: 'Пациент',
            key: 'patient_full_name',
            render: (record: IVisit) => (
                <Button
                    type="link"
                    onClick={() => navigate(`/patients/${record.patient_id}`)}
                >
                    {record.patient_full_name}
                </Button>
            ),
        },
        {
            title: 'Статус',
            key: 'status_title',
            dataIndex: 'status_title',
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (record: IVisit) => (
                <Button
                    type="primary"
                    onClick={() => navigate(`/visits/${record.id}`)}
                >
                    Подробнее
                </Button>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Все визиты</h1>
                <Button
                    type="primary"
                    onClick={() => navigate('/patients')}
                >
                    Все пациенты
                </Button>
            </div>
            <CustomTable
                columns={columns}
                dataSource={data?.results}
                loading={isLoading}
                setPage={setPage}
                current={page}
                total={data?.count ?? 0}
            />
        </div>
    );
};
