import styles from "./styles.module.scss";
import { CustomTable } from "../../components/Shared/CustomTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../api";
import {
  ActionType,
  FormInitialFieldsParamsType,
  IGet,
} from "../../types/common.ts";
import { useState } from "react";
import { customNotification } from "../../utils/customNotification.ts";
import { Button, Modal } from "antd";
import { changeFormFieldsData } from "../../utils/changeFormFieldsData.ts";
import {
  IDescriptionFragment,
  IDescriptionFragmentCreate,
  IDescriptionFragmentUpdate,
} from "../../types/descriptionFragment.ts";
import { DescriptionFragmentCreateUpdateForm } from "../../components/DescriptionFragmentCreateUpdateForm/DescriptionFragmentCreateUpdateForm.tsx";
import { useParams } from "react-router-dom";
import ShowMoreContainer from "../../components/Shared/ShowMoreContainer/ShowMoreContainer.tsx";

const initialValues: FormInitialFieldsParamsType[] = [
  {
    name: "doctor_profile",
    value: null,
  },
  {
    name: "title",
    value: "",
  },
  {
    name: "content",
    value: "",
  },
  {
    name: "ordering_number",
    value: null,
  },
];

const DescriptionFragmentPage = () => {
  const queryClient = useQueryClient();
  const pathname = useParams();
  const [page, setPage] = useState(1);
  const [createUpdateModalOpen, setCreateUpdateModalOpen] =
    useState<boolean>(false);
  const [editEntity, setEditEntity] = useState<IDescriptionFragment | null>(
    null,
  );
  const [createUpdateFormInitialFields, setCreateUpdateFormInitialFields] =
    useState<FormInitialFieldsParamsType[]>(initialValues);
  const [formType, setFormType] = useState<ActionType>("");

  const { mutate: onUpdate, isPending: isUpdateLoading } = useMutation({
    mutationKey: ["updateDescriptionFragment"],
    mutationFn: ({ id, ...body }: IDescriptionFragmentUpdate) => {
      return axiosInstance.put(
        `employee_endpoints/doctors/${pathname?.id}/description_fragments/${id}/`,
        body,
      );
    },
    onSuccess: () => {
      customNotification({
        type: "success",
        message: "Фрагмент описания успешно изменен!",
      });
      queryClient.invalidateQueries({ queryKey: ["descriptionFragmentsData"] });
    },
  });

  const { mutate: onCreate, isPending: isCreateLoading } = useMutation({
    mutationKey: ["createDescriptionFragment"],
    mutationFn: (body: IDescriptionFragmentCreate) => {
      return axiosInstance.post(
        `employee_endpoints/doctors/${pathname?.id}/description_fragments/`,
        body,
      );
    },
    onSuccess: () => {
      customNotification({
        type: "success",
        message: "Фрагмент описания успешно создан!",
      });
      queryClient.invalidateQueries({ queryKey: ["descriptionFragmentsData"] });
    },
  });

  const { mutate: onDelete, isPending: isDeleteLoading } = useMutation({
    mutationKey: ["deleteDescriptionFragment"],
    mutationFn: (id: number) =>
      axiosInstance.delete(
        `employee_endpoints/doctors/${pathname?.id}/description_fragments/${id}/`,
      ),
    onSuccess: () => {
      customNotification({
        type: "success",
        message: "Фрагмент описания успешно удален!",
      });
      queryClient.invalidateQueries({ queryKey: ["descriptionFragmentsData"] });
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["descriptionFragmentsData", page],
    queryFn: () =>
      axiosInstance
        .get<
          IGet<IDescriptionFragment>
        >(`employee_endpoints/doctors/${pathname?.id}/description_fragments/?page=${page}`)
        .then((response) => response?.data),
  });

  const onClose = () => {
    setCreateUpdateModalOpen(false);
    setCreateUpdateFormInitialFields(initialValues);
    setEditEntity(null);
    setFormType("");
  };

  const onOpenCreateUpdateModal = (
    data: IDescriptionFragment | null,
    type: ActionType,
  ) => {
    if (data && type === "update") {
      setEditEntity(data);
      setCreateUpdateFormInitialFields(
        changeFormFieldsData<object>(initialValues, data),
      );
    }

    setFormType(type);
    setCreateUpdateModalOpen(true);
  };

  const onSubmitCreateUpdateModal = async (
    formData: IDescriptionFragmentCreate,
  ) => {
    if (formType === "update") {
      const payload = {
        ...formData,
        id: editEntity?.id as number,
        doctor: parseInt(pathname?.id ?? ""),
      };

      onUpdate(payload);
    } else {
      onCreate({
        ...formData,
        doctor_profile: parseInt(pathname?.id ?? ""),
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
      title: "Идентификатор врача",
      key: "doctor_profile",
      dataIndex: "doctor_profile",
    },
    {
      title: "Заголовок",
      key: "title",
      dataIndex: "title",
    },
    {
      title: "Контент",
      key: "content",
      dataIndex: "content",
      render: (item: string) => (
        <ShowMoreContainer>
          <div dangerouslySetInnerHTML={{ __html: item }} />
        </ShowMoreContainer>
      ),
    },
    {
      title: "Номер",
      key: "ordering_number",
      dataIndex: "ordering_number",
    },
    {
      title: "Редактировать",
      render: (data: IDescriptionFragment) => (
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
      render: (data: IDescriptionFragment) => (
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
            ? "Создание фрагмента описания"
            : "Редактирование фрагмента описания"
        }
        footer={<></>}
        open={createUpdateModalOpen}
        onCancel={onClose}
        width="80%"
      >
        <DescriptionFragmentCreateUpdateForm
          formType={formType}
          initialFields={createUpdateFormInitialFields}
          onSubmit={onSubmitCreateUpdateModal}
          onClose={onClose}
          isLoading={isUpdateLoading || isCreateLoading}
        />
      </Modal>
      <div className={styles.container}>
        <div className={styles.title_wrap}>
          <div className={styles.title}>Данные описания врача</div>
          <div className={styles.action}>
            <Button
              onClick={() => onOpenCreateUpdateModal(null, "create")}
              type={"primary"}
              size={"large"}
            >
              Создать
            </Button>
          </div>
        </div>
        <CustomTable
          columns={columns}
          dataSource={data?.results ?? []}
          loading={isLoading}
          setPage={setPage}
          pagination={false}
          current={1}
          total={data?.count ?? 0}
        />
      </div>
    </>
  );
};

export default DescriptionFragmentPage;
