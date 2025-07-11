import styles from "./styles.module.scss";
import { CustomTable } from "../../components/Shared/CustomTable";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../api";
import { useStateContext } from "../../contexts";
import { TextButton } from "../../components/Shared/Buttons/TextButton";
import {
  IMonthSummary,
  IPatientClinicVisits,
} from "../../types/monthSummary.ts";
import { useNavigate } from "react-router-dom";
import { IGet } from "../../types/common.ts";
import { useState } from "react";

const MonthSummaryPage = () => {
  const { state } = useStateContext();

  const { addressId } = state;

  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const columns = [
    {
      title: "Месяц визита",
      key: "month_name",
      render: (item: IMonthSummary) => (
        <TextButton
          text={item?.month_name}
          type={"primary"}
          action={() => navigate(`${item?.id}`)}
        />
      ),
    },
    {
      title: "Всего визитов",
      key: "total_visits_count",
      dataIndex: "patient_clinic_visits",
      render: (item: IPatientClinicVisits) => (
        <div>{item?.total_visits_count}</div>
      ),
    },
    {
      title: "Визитов, утвержденных нами",
      key: "total_visits_count_approved_by_us",
      dataIndex: "patient_clinic_visits",
      render: (item: IPatientClinicVisits) => (
        <div>{item?.total_visits_count_approved_by_us}</div>
      ),
    },
    {
      title: "Визитов, утвержденных клиникой",
      key: "total_visits_count_approved_by_clinic",
      dataIndex: "patient_clinic_visits",
      render: (item: IPatientClinicVisits) => (
        <div>{item?.total_visits_count_approved_by_clinic}</div>
      ),
    },
    {
      title: "Дата начала",
      key: "start_date",
      dataIndex: "start_date",
    },
    {
      title: "Дата окончания",
      key: "end_date",
      dataIndex: "end_date",
    },
    {
      title: "Оплачен",
      key: "payment_status",
      dataIndex: "payment_status",
      render: (item: boolean) => <div>{item ? "Да" : "Нет"}</div>,
    },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ["monthSummaryData", addressId],
    queryFn: () =>
      axiosInstance
        .get<
          IGet<IMonthSummary>
        >(`employee_endpoints/clinics/${addressId}/monthly-summaries/?page=${page}`)
        .then((response) => response?.data),
    enabled: !!addressId,
  });

  return (
    <div className={styles.container}>
      <CustomTable
        columns={columns}
        dataSource={data?.results ?? []}
        loading={isLoading}
        setPage={setPage}
        current={page}
        total={data?.count ?? 0}
      />
    </div>
  );
};

export default MonthSummaryPage;
