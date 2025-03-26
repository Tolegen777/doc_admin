import styles from "./styles.module.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Modal } from "antd";
import { axiosInstance } from "../../../api";
import { customNotification } from "../../../utils/customNotification.ts";
import {
  ActionType,
  FormInitialFieldsParamsType,
  IGet,
} from "../../../types/common.ts";
import { changeFormFieldsData } from "../../../utils/changeFormFieldsData.ts";
import { DoctorWorkScheduleCreateUpdateForm } from "../DoctorWorkScheduleCreateUpdateForm/DoctorWorkScheduleCreateUpdateForm.tsx";
import { CustomTable } from "../../Shared/CustomTable";
// import {
//   ICreateAllDoctorSchedule,
//   IUpdateAllDoctorSchedule,
// } from "../../../types/allDoctors.ts";
import { IFranchise } from "../../../types/franchiseTypes.ts";
import { ITime } from "../../../types/calendar.ts";
import {
  datePickerFormatter,
  formatDateToString,
  getRussianDayOfWeek,
  removeSeconds,
} from "../../../utils/date/getDates.ts";
import { useParams } from "react-router-dom";
import {
  IDoctorSchedule,
  IDoctorScheduleCreateUpdate,
} from "../../../types/doctor.ts";

const initialValues: FormInitialFieldsParamsType[] = [
  {
    name: "clinic",
    value: null,
  },
  {
    name: "date",
    value: null,
  },
  {
    name: "working_hours",
    value: [],
  },
];

const DoctorWorkSchedulesPage = () => {
  const queryClient = useQueryClient();
  const pathname = useParams();

  const doctorId = pathname?.id;

  const [page, setPage] = useState(1);
  const [createUpdateModalOpen, setCreateUpdateModalOpen] =
    useState<boolean>(false);
  const [editEntity, setEditEntity] = useState<IDoctorSchedule | null>(null);
  const [createUpdateFormInitialFields, setCreateUpdateFormInitialFields] =
    useState(initialValues);
  const [formType, setFormType] = useState<ActionType>("");

  const { mutate: onUpdate, isPending: isUpdateLoading } = useMutation({
    mutationFn: ({ id, ...body }: IDoctorScheduleCreateUpdate) => {
      return axiosInstance.patch(
        `employee_endpoints/doctors/${doctorId}/schedules/${id}/`,
        body,
      );
    },
    onSuccess: () => {
      customNotification({
        type: "success",
        message: "Расписание успешно изменено!",
      });
      queryClient.invalidateQueries({ queryKey: ["doctorWorkSchedulesData"] });
    },
  });

  const { mutate: onCreate, isPending: isCreateLoading } = useMutation({
    mutationFn: (body: IDoctorScheduleCreateUpdate) => {
      return axiosInstance.post(
        `employee_endpoints/doctors/${doctorId}/schedules/`,
        body,
      );
    },
    onSuccess: () => {
      customNotification({
        type: "success",
        message: "Расписание успешно создано!",
      });
      queryClient.invalidateQueries({ queryKey: ["doctorWorkSchedulesData"] });
    },
  });

  const { mutate: onDelete, isPending: isDeleteLoading } = useMutation({
    mutationFn: (id: number) =>
      axiosInstance.delete(
        `employee_endpoints/doctors/${doctorId}/schedules/${id}/`,
      ),
    onSuccess: () => {
      customNotification({
        type: "success",
        message: "Расписание успешно удалено!",
      });
      queryClient.invalidateQueries({ queryKey: ["doctorWorkSchedulesData"] });
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["doctorWorkSchedulesData", doctorId, page],
    queryFn: () =>
      axiosInstance
        .get<
          IGet<IDoctorSchedule>
        >(`employee_endpoints/doctors/${doctorId}/schedules/?page=${page}`)
        .then((response) => response?.data),
    enabled: !!doctorId,
  });

  const { data: clinics, isLoading: clinicsLoading } = useQuery({
    queryKey: ["franchiseBranches"],
    queryFn: () =>
      axiosInstance
        .get<IFranchise[]>("employee_endpoints/clinics/?page_size=100")
        .then((response) => response.data),
    refetchOnMount: false,
  });

  const { data: workingHours, isLoading: workingHoursLoading } = useQuery({
    queryKey: ["TimeSlotsList"],
    queryFn: () =>
      axiosInstance
        .get<ITime[]>(`employee_endpoints/clinics/time_slots/`)
        .then((response) =>
          response?.data?.map((item) => ({
            ...item,
            start_time: removeSeconds(item?.start_time ?? ""),
          })),
        ),
    refetchOnMount: false,
  });

  const onClose = () => {
    setCreateUpdateModalOpen(false);
    setCreateUpdateFormInitialFields(initialValues);
    setEditEntity(null);
    setFormType("");
  };

  const onOpenCreateUpdateModal = (
    data: IDoctorSchedule | null,
    type: ActionType,
  ) => {
    if (data && type === "update") {
      setEditEntity(data);
      setCreateUpdateFormInitialFields(
        changeFormFieldsData(initialValues, {
          ...data,
          date: datePickerFormatter(data?.date ?? ""),
          working_hours: data?.working_hours,
          clinic: data?.clinic,
        }),
      );
    }

    setFormType(type);
    setCreateUpdateModalOpen(true);
  };

  const onSubmitCreateUpdateModal = async (formData: any) => {
    if (formType === "update") {
      const payload = {
        ...formData,
        id: editEntity?.id as number,
        date: formatDateToString(formData?.date?.$d ?? null) ?? "",
        doctor_profile: doctorId,
      };

      onUpdate(payload);
    } else {
      onCreate({
        ...formData,
        date: formatDateToString(formData?.date?.$d ?? null) ?? "",
        doctor_profile: doctorId,
      });
    }

    onClose();
  };

  const handleDelete = (id: number) => {
    onDelete(id);
  };

  const columns = [
    {
      title: "ID",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "Филиал клиники",
      key: "clinic",
      dataIndex: "clinic",
    },
    {
      title: "Адрес клиники",
      key: "clinic_address",
      dataIndex: "clinic_address",
    },
    {
      title: "Дата работы",
      key: "date",
      dataIndex: "date",
    },
    {
      title: "День недели",
      key: "day_of_week",
      dataIndex: "day_of_week",
      render: (day: string) => getRussianDayOfWeek(day ?? ""),
    },
    {
      title: "Редактировать",
      render: (data: IDoctorSchedule) => (
        <Button
          onClick={() => onOpenCreateUpdateModal(data, "update")}
          type={"primary"}
        >
          Редактировать
        </Button>
      ),
    },
    {
      title: "Удалить",
      render: (data: IDoctorSchedule) => (
        <Button
          onClick={() => handleDelete(data?.id as number)}
          disabled={isDeleteLoading}
        >
          Удалить
        </Button>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={
          formType === "create"
            ? "Создание расписания"
            : "Редактирование расписания"
        }
        footer={<></>}
        open={createUpdateModalOpen}
        onCancel={onClose}
        width="80%"
      >
        <DoctorWorkScheduleCreateUpdateForm
          formType={formType}
          initialFields={createUpdateFormInitialFields}
          onSubmit={onSubmitCreateUpdateModal}
          onClose={onClose}
          isLoading={isUpdateLoading || isCreateLoading}
          clinicLoading={clinicsLoading}
          workingHoursLoading={workingHoursLoading}
          clinics={clinics ?? null}
          workingHours={workingHours ?? []}
        />
      </Modal>
      <div className={styles.container}>
        <div className={styles.action}>
          <Button
            onClick={() => onOpenCreateUpdateModal(null, "create")}
            type={"primary"}
            size={"large"}
          >
            Создать
          </Button>
        </div>
        <CustomTable
          columns={columns}
          dataSource={data?.results ?? []}
          loading={isLoading}
          setPage={setPage}
          pagination={false}
          current={page}
          total={data?.count ?? 0}
        />
      </div>
    </>
  );
};

export default DoctorWorkSchedulesPage;
