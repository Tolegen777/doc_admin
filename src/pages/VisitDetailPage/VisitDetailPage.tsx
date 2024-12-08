import {useNavigate, useParams} from "react-router-dom";
import {axiosInstance} from "../../api";
import styles from "./styles.module.scss";
import {Button, Card, Descriptions} from "antd";
import {formatDate} from "../../utils/date/getDates.ts";
import {useQuery} from "@tanstack/react-query";

export const VisitDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ['visitDetail', id],
        queryFn: () =>
            axiosInstance
                .get(`partners/franchise-info/all-visits/${id}/`)
                .then((response) => response.data),
    });

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className={styles.container}>
            <Button
                onClick={() => navigate(-1)}
                style={{ marginBottom: 16 }}
            >
                Назад
            </Button>
            <Card title="Детали визита">
                <Descriptions bordered>
                    <Descriptions.Item label="Дата">{data?.date}</Descriptions.Item>
                    <Descriptions.Item label="Время">{data?.visit_time_slot}</Descriptions.Item>
                    <Descriptions.Item label="Филиал">{data?.clinic_branch_title}</Descriptions.Item>
                    <Descriptions.Item label="Врач">{data?.doctor_full_name}</Descriptions.Item>
                    <Descriptions.Item label="Процедура">{data?.procedure_title}</Descriptions.Item>
                    <Descriptions.Item label="Пациент">
                        <Button
                            type="link"
                            onClick={() => navigate(`/patients/${data?.patient_id}`)}
                        >
                            {data?.patient_full_name}
                        </Button>
                    </Descriptions.Item>
                    <Descriptions.Item label="Статус">{data?.status_title}</Descriptions.Item>
                    <Descriptions.Item label="Создан">{formatDate(data?.created_at)}</Descriptions.Item>
                    <Descriptions.Item label="Обновлен">{formatDate(data?.updated_at)}</Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
};
