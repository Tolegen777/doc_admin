import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {Button} from "antd";
import {CustomTable} from "../../components/Shared/CustomTable";
import styles from "./styles.module.scss";

interface IPatient {
    id: number;
    full_name: string;
    birth_date: string;
    phone_number: string;
    visits_count: number;
}

export const PatientsPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['patientsData', page],
        queryFn: () =>
            axiosInstance
                .get(`partners/franchise-info/all-visits/patients/?page=${page}`)
                .then((response) => response.data),
    });

    const columns = [
        {
            title: 'ФИО',
            key: 'full_name',
            dataIndex: 'full_name',
        },
        {
            title: 'Дата рождения',
            key: 'birth_date',
            dataIndex: 'birth_date',
        },
        {
            title: 'Телефон',
            key: 'phone_number',
            dataIndex: 'phone_number',
        },
        {
            title: 'Количество визитов',
            key: 'visits_count',
            dataIndex: 'visits_count',
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (record: IPatient) => (
                <div className={styles.actions}>
                    <Button
                        onClick={() => navigate(`/patients/${record.id}/visits`)}
                        style={{ marginRight: 8 }}
                    >
                        Визиты
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => navigate(`/patients/${record.id}`)}
                    >
                        Подробнее
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <h1>Все пациенты</h1>
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
