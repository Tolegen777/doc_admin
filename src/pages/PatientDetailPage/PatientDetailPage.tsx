import {useNavigate, useParams} from "react-router-dom";
import {axiosInstance} from "../../api";
import styles from "../AllVisitsPage/styles.module.scss";
import {Button, Card, Descriptions} from "antd";
import {useQuery} from "@tanstack/react-query";

export const PatientDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ['patientDetail', id],
        queryFn: () =>
            axiosInstance
                .get(`partners/franchise-info/all-visits/patients/${id}/`)
                .then((response) => response.data),
    });

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Button
                    onClick={() => navigate(-1)}
                    style={{ marginRight: 16 }}
                >
                    Назад
                </Button>
                <Button
                    type="primary"
                    onClick={() => navigate(`/patients/${id}/visits`)}
                >
                    Визиты пациента
                </Button>
            </div>
            <Card title="Информация о пациенте">
                <Descriptions bordered>
                    <Descriptions.Item label="ФИО">{data?.full_name}</Descriptions.Item>
                    <Descriptions.Item label="Дата рождения">{data?.birth_date}</Descriptions.Item>
                    <Descriptions.Item label="Телефон">{data?.phone_number}</Descriptions.Item>
                    <Descriptions.Item label="ИИН">{data?.iin_number}</Descriptions.Item>
                    <Descriptions.Item label="Email">{data?.email}</Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
};
