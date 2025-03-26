import styles from "./styles.module.scss";
import { memo } from "react";
import { Descriptions, Spin } from "antd";
import { IVisit } from "../../../../types/visits.ts";
import { formatDateTime } from "../../../../utils/date/getDates.ts";

type Props = {
  data: IVisit | undefined;
  isLoading: boolean;
};

export const SlotAdditionalInfoBlock = memo(({ data, isLoading }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.container_title}>Информация о записи</div>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin />
        </div>
      ) : (
        data && (
          <Descriptions column={1}>
            <Descriptions.Item label="Франшиза">
              {data?.clinic?.title}
            </Descriptions.Item>
            <Descriptions.Item label="Оплачен">
              {data?.is_paid ? "Да" : "Нет"}
            </Descriptions.Item>
            <Descriptions.Item label="Пациент">
              {data?.patient?.full_name}
            </Descriptions.Item>
            <Descriptions.Item label="День рожение пациента">
              {data?.patient?.birth_date}
            </Descriptions.Item>
            {data?.patient?.iin_number && (
              <Descriptions.Item label="ИИН пациента">
                {data?.patient?.iin_number}
              </Descriptions.Item>
            )}
            {data?.patient?.phone_number && (
              <Descriptions.Item label="Телефон пациента">
                {data?.patient?.phone_number}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Статус">
              {data?.visit_status.title}
            </Descriptions.Item>
            <Descriptions.Item label="Описание статуса">
              {data?.note}
            </Descriptions.Item>
            <Descriptions.Item label="Дата создания">
              {formatDateTime({
                isoDateTime: data?.created_at,
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Дата обновления">
              {formatDateTime({
                isoDateTime: data?.updated_at,
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Подтверждено">
              {data?.approved_by_clinic ? "Да" : "Нет"}
            </Descriptions.Item>
            {/*<Descriptions.Item label="Одобрено">{data?.approved ? 'Да' : 'Нет'}</Descriptions.Item>*/}
          </Descriptions>
        )
      )}
    </div>
  );
});
