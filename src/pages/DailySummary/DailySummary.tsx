import styles from "./styles.module.scss";
import { CustomTable } from "../../components/Shared/CustomTable";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../api";
import { useStateContext } from "../../contexts";
import { IDailySummary } from "../../types/dailySummary.ts";

const DailySummaryPage = () => {
  const { state } = useStateContext();

  const { addressId } = state;

  const columns = [
    {
      title: "Дата визита",
      key: "visit_date",
      dataIndex: "visit_date",
    },
    {
      title: "Временной интервал визита",
      key: "visit_time_slot",
      dataIndex: "visit_time_slot",
    },
    {
      title: "ФИО врача",
      key: "doctor_full_name",
      dataIndex: "doctor_full_name",
    },
    {
      title: "Процедура врача",
      key: "doctor_procedure_title",
      dataIndex: "doctor_procedure_title",
    },
    {
      title: "Телефон пациента",
      key: "patient_phone_number",
      dataIndex: "patient_phone_number",
    },
    {
      title: "ИИН пациента",
      key: "patient_iin_number",
      dataIndex: "patient_iin_number",
    },
    {
      title: "Статус визита",
      key: "visit_status_title",
      dataIndex: "visit_status_title",
    },
    {
      title: "Цена визита",
      key: "visit_price",
      dataIndex: "visit_price",
    },
    {
      title: "Комиссия за визит",
      key: "visit_comission_amount",
      dataIndex: "visit_comission_amount",
    },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ["dailyData", addressId],
    queryFn: () =>
      axiosInstance
        .get<IDailySummary>(
          `partners/franchise-branches/${addressId}/daily-summary/`,
        )
        .then((response) => response?.data),
    enabled: !!addressId,
  });

  return (
    <div className={styles.container}>
      <CustomTable
        columns={columns}
        dataSource={data?.visits ?? []}
        loading={isLoading}
      />
    </div>
  );
};

export default DailySummaryPage;
