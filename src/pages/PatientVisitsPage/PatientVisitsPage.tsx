import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {Button} from "antd";
import {CustomTable} from "../../components/Shared/CustomTable";
import styles from "./styles.module.scss";

export const PatientVisitsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['patientVisits', id, page],
        queryFn: () =>
            axiosInstance
                .get(`partners/franchise-info/all-visits/patients/${id}/visits/?page=${page}`)
                .then((response) => response.data),
    });

    const columns = [
        {
            title: 'Дата',
            key: 'date',
            dataIndex: 'date',
        },
        {
            title: 'Время',
            key: 'visit_time_slot',
            dataIndex: 'visit_time_slot',
        },
        {
            title: 'Филиал',
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
            title: 'Статус',
            key: 'status_title',
            dataIndex: 'status_title',
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (record: any) => (
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
                <Button onClick={() => navigate(-1)}>Назад</Button>
                <h1>Визиты пациента</h1>
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
