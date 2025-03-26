// VisitsPage.tsx
import { CustomTable } from "../../components/Shared/CustomTable";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../api";
import { useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import { IVisit } from "../../types/visits";

export const AllVisitsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["visitsData", page],
    queryFn: () =>
      axiosInstance
        .get(`employee_endpoints/visits/?page=${page}`)
        .then((response) => response.data),
  });

  const columns = [
    {
      title: "Дата визита",
      key: "date",
      dataIndex: "date",
    },
    {
      title: "Время",
      key: "visit_time_slot",
      dataIndex: "visit_time_slot",
      render: (visit: IVisit["visit_time_slot"]) => (
        <div>{visit?.start_time}</div>
      ),
    },
    {
      title: "Филиал клиники",
      key: "clinic",
      dataIndex: "clinic",
      render: (visit: IVisit["clinic"]) => <div>{visit?.title}</div>,
    },
    {
      title: "Врач",
      key: "doctor_profile",
      dataIndex: "doctor_profile",
      render: (visit: IVisit["doctor_profile"]) => (
        <div>{visit?.full_name}</div>
      ),
    },
    {
      title: "Процедура",
      key: "doctor_procedure",
      dataIndex: "doctor_procedure",
      render: (visit: IVisit["doctor_procedure"]) => (
        <div>{visit?.medical_procedure?.title}</div>
      ),
    },
    {
      title: "Пациент",
      key: "patient",
      render: (record: IVisit) => (
        <Button
          type="link"
          onClick={() => navigate(`/patients/${record.patient.id}`)}
        >
          {record.patient.full_name}
        </Button>
      ),
    },
    {
      title: "Статус",
      key: "visit_status",
      dataIndex: "visit_status",
      render: (visit: IVisit["visit_status"]) => <div>{visit?.title}</div>,
    },
    {
      title: "Действия",
      key: "actions",
      render: (record: IVisit) => (
        <Button type="primary" onClick={() => navigate(`/visits/${record.id}`)}>
          Подробнее
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Все визиты</h1>
        <Button type="primary" onClick={() => navigate("/patients")}>
          Все пациенты
        </Button>
      </div>
      <CustomTable
        columns={columns}
        dataSource={data}
        loading={isLoading}
        setPage={setPage}
        current={page}
        total={data?.length ?? 0}
      />
    </div>
  );
};
