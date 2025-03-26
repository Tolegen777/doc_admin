import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../api";
import styles from "./styles.module.scss";
import { Button, Card, Descriptions } from "antd";
import { formatDate } from "../../utils/date/getDates.ts";
import { useQuery } from "@tanstack/react-query";
import { IVisit } from "../../types/visits.ts";

export const VisitDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["visitDetail", id],
    queryFn: () =>
      axiosInstance
        .get<IVisit>(`employee_endpoints/visits/${id}/`)
        .then((response) => response.data),
  });

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className={styles.container}>
      <Button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        Назад
      </Button>
      <Card title="Детали визита">
        <Descriptions bordered>
          <Descriptions.Item label="Дата">{data?.date}</Descriptions.Item>
          <Descriptions.Item label="Время">
            {data?.visit_time_slot.start_time}
          </Descriptions.Item>
          <Descriptions.Item label="Филиал">
            {data?.clinic.title}
          </Descriptions.Item>
          <Descriptions.Item label="Врач">
            {data?.doctor_profile.full_name}
          </Descriptions.Item>
          <Descriptions.Item label="Процедура">
            {data?.doctor_procedure.medical_procedure.title}
          </Descriptions.Item>
          <Descriptions.Item label="Пациент">
            <Button
              type="link"
              onClick={() => navigate(`/patients/${data?.patient.id}`)}
            >
              {data?.patient.full_name}
            </Button>
          </Descriptions.Item>
          <Descriptions.Item label="Статус">
            {data?.visit_status.title}
          </Descriptions.Item>
          <Descriptions.Item label="Создан">
            {formatDate(data?.created_at ?? "")}
          </Descriptions.Item>
          <Descriptions.Item label="Обновлен">
            {formatDate(data?.updated_at ?? "")}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};
