import styles from "./styles.module.scss";
import { CustomTable } from "../../components/Shared/CustomTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../api";
import { useStateContext } from "../../contexts";
import { IVisit, IVisitCreate } from "../../types/visits.ts";
import {
  datePickerFormatter,
  formatDateTime,
  formatDateToString,
} from "../../utils/date/getDates.ts";
import { DoctorProfile } from "../../components/Doctors/DoctorProfile/DoctorProfile.tsx";
import { FormInitialFieldsParamsType } from "../../types/common.ts";
import { objectToQueryParams } from "../../utils/objectToQueryParams.ts";
import { useState } from "react";
import { customNotification } from "../../utils/customNotification.ts";
import { Button, Drawer } from "antd";
import { changeFormFieldsData } from "../../utils/changeFormFieldsData.ts";
import { VisitUpdateForm } from "../../components/Visits/VisitUpdateForm/VisitUpdateForm.tsx";
import { useNavigate } from "react-router-dom";

const initialValues: FormInitialFieldsParamsType[] = [
  {
    name: "date",
    value: "",
  },
  {
    name: "is_child",
    value: false,
  },
  {
    name: "note",
    value: "",
  },
  {
    name: "paid",
    value: false,
  },
  {
    name: "approved_by_clinic",
    value: false,
  },
  {
    name: "status_id",
    value: null,
  },
];

const VisitsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { state } = useStateContext();

  const { addressId, visitsQuery } = state;

  const [page, setPage] = useState(1);
  const [createUpdateModalOpen, setCreateUpdateModalOpen] =
      useState<boolean>(false);
  const [editEntity, setEditEntity] = useState<IVisit | null>(null);
  const [createUpdateFormInitialFields, setCreateUpdateFormInitialFields] =
      useState<FormInitialFieldsParamsType[]>(initialValues);

  const { mutate: onUpdate, isPending: isUpdateLoading } = useMutation({
    mutationKey: ["updateVisit"],
    mutationFn: ({ id, ...body }: IVisitCreate) => {
      return axiosInstance.patch(`employee_endpoints/visits/${id}/`, body);
    },
    onSuccess: () => {
      customNotification({
        type: "success",
        message: "Запись успешно изменена!",
      });
      queryClient.invalidateQueries({ queryKey: ["visitsData"] });
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["visitsData", addressId, visitsQuery, page],
    queryFn: () =>
        axiosInstance
            .get<IVisit[]>(
                `employee_endpoints/clinics/${addressId}/visits/?page=${page}&${objectToQueryParams(
                    {
                      part_of_name: visitsQuery,
                    },
                )}`,
            )
            .then((response) => response?.data),
    enabled: !!addressId,
  });

  const onClose = () => {
    setCreateUpdateModalOpen(false);
    setCreateUpdateFormInitialFields(initialValues);
    setEditEntity(null);
  };

  const onOpenCreateUpdateModal = (data: IVisit) => {
    if (data) {
      setEditEntity(data);
      setCreateUpdateFormInitialFields(
          changeFormFieldsData<object>(initialValues, {
            ...data,
            date: datePickerFormatter(data?.date ?? ""),
            status_id: data?.visit_status?.id,
            paid: data?.is_paid,
          }),
      );
    }

    setCreateUpdateModalOpen(true);
  };

  const onSubmitCreateUpdateModal = async (formData: IVisitCreate) => {
    const payload = {
      ...formData,
      date: formatDateToString(formData?.date?.$d ?? null) ?? "",
      id: editEntity?.id,
      // Добавляем обязательные поля для IVisitCreate
      doctor_id: editEntity?.doctor_profile?.id || null,
      doctor_procedure_id: editEntity?.doctor_procedure?.id || null,
      visit_time_id: editEntity?.visit_time_slot?.id || null,
      clinic_branch_id: editEntity?.clinic?.id || null,
      patient_id: editEntity?.patient?.id || null,
      approved: editEntity?.approved_by_admin || false,
    };

    onUpdate(payload);
    onClose();
  };

  const handleVisitIdClick = (visitId: number) => {
    navigate(`/visits/${visitId}`);
  };

  const columns = [
    {
      title: "Идентификатор",
      key: "id",
      dataIndex: "id",
      render: (id: number) => (
          <Button
              type="link"
              onClick={() => handleVisitIdClick(id)}
              style={{ padding: 0, height: 'auto', fontSize: '14px' }}
          >
            #{id}
          </Button>
      ),
    },
    {
      title: "Дата визита",
      key: "date",
      render: (visit: IVisit) => (
          <p>
            {formatDateTime({
              inputDate: visit?.date,
              inputTime: visit?.visit_time_slot.start_time,
            })}
          </p>
      ),
    },
    {
      title: "Дата создания/обновления",
      key: "visit_time_slot",
      render: (visit: IVisit) => (
          <div>
            <p>
              {formatDateTime({
                isoDateTime: visit?.created_at,
              })}
            </p>
            {visit?.updated_at?.length > 0 && (
                <p>
                  Изменено:{" "}
                  {formatDateTime({
                    isoDateTime: visit?.updated_at,
                  })}
                </p>
            )}
          </div>
      ),
    },
    {
      title: "Врач",
      key: "doctor_profile",
      render: (visit: IVisit) => (
          <DoctorProfile
              title={visit?.doctor_profile?.full_name}
              subTitle={visit?.doctor_procedure?.medical_procedure?.title}
              imgSrc={""}
          />
      ),
    },
    {
      title: "Статус",
      key: "visit_status",
      render: (visit: IVisit) => (
          <div>
            <div>{visit.visit_status.title}</div>
          </div>
      ),
    },
    {
      title: "Пациент",
      key: "patient",
      render: (visit: IVisit) => {
        return (
            <div>
              <div>{visit?.patient?.full_name}</div>
              <div>{visit?.patient?.phone_number}</div>
              <div>{visit?.patient?.iin_number}</div>
            </div>
        );
      },
    },
    {
      title: "Редактировать",
      render: (data: IVisit) => (
          <Button onClick={() => onOpenCreateUpdateModal(data)} type={"primary"}>
            Редактировать
          </Button>
      ),
    },
  ];

  return (
      <>
        <Drawer
            title={"Редактирование записи"}
            onClose={onClose}
            open={createUpdateModalOpen}
            width="500px"
        >
          <VisitUpdateForm
              formType={"update"}
              initialFields={createUpdateFormInitialFields}
              onSubmit={onSubmitCreateUpdateModal}
              onClose={onClose}
              isLoading={isUpdateLoading}
          />
        </Drawer>
        <div className={styles.container}>
          <CustomTable
              columns={columns}
              dataSource={data}
              loading={isLoading}
              setPage={setPage}
              total={data?.length ?? 0}
              current={page}
          />
        </div>
      </>
  );
};

export default VisitsPage;
