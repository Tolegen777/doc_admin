import styles from "./styles.module.scss";
import { CustomTable } from "../../components/Shared/CustomTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../api";
import { useStateContext } from "../../contexts";
import { ActionType, FormInitialFieldsParamsType } from "../../types/common.ts";
import { useState } from "react";
import { customNotification } from "../../utils/customNotification.ts";
import { Button, Drawer } from "antd";
import { changeFormFieldsData } from "../../utils/changeFormFieldsData.ts";
import {
  IFranchise,
  IFranchiseCreateUpdate,
  IFranchisePhoto,
} from "../../types/franchiseTypes.ts";
import { FranchiseCreateUpdateForm } from "../../components/Franchise/FranchiseCreateUpdateForm/FranchiseCreateUpdateForm.tsx";
import { PhotoForm } from "../../components/Franchise/PhotoForm/PhotoForm.tsx";
import { CityTypes } from "../../types/cityTypes.ts";
import ShowMoreContainer from "../../components/Shared/ShowMoreContainer/ShowMoreContainer.tsx";

const initialValues: FormInitialFieldsParamsType[] = [
  {
    name: "title",
    value: "",
  },
  {
    name: "description",
    value: "",
  },
  {
    name: "address",
    value: "",
  },
  {
    name: "latitude",
    value: 0,
  },
  {
    name: "longitude",
    value: 0,
  },
  {
    name: "city",
    value: null,
  },
];

const photoInitialValues: FormInitialFieldsParamsType[] = [
  {
    name: "branch",
    value: null,
  },
  {
    name: "photo",
    value: "",
  },
  {
    name: "title_code",
    value: "",
  },
  {
    name: "is_main",
    value: false,
  },
];

const formatCoordinates = (latitude: number, longitude: number) => {
  return `Lat: ${latitude}, Lng: ${longitude}`;
};

const FranchisePage = () => {
  const queryClient = useQueryClient();
  const { state } = useStateContext();
  const { addressId } = state;
  const [page, setPage] = useState(1);
  const [createUpdateModalOpen, setCreateUpdateModalOpen] =
    useState<boolean>(false);
  const [editEntity, setEditEntity] = useState<IFranchise | null>(null);
  const [createUpdateFormInitialFields, setCreateUpdateFormInitialFields] =
    useState<FormInitialFieldsParamsType[]>(initialValues);
  const [formType, setFormType] = useState<ActionType>("");
  const [photoModalOpen, setPhotoModalOpen] = useState<boolean>(false);
  const [photoFormInitialFields, setPhotoFormInitialFields] =
    useState<FormInitialFieldsParamsType[]>(photoInitialValues);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [photosDrawerOpen, setPhotosDrawerOpen] = useState<boolean>(false);
  const [photoFormType, setPhotoFormType] = useState<ActionType>("");
  const [photoEditEntity, setPhotoEditEntity] =
    useState<IFranchisePhoto | null>(null);

  const { mutate: onUpdate, isPending: isUpdateLoading } = useMutation({
    mutationKey: ["updateFranchise"],
    mutationFn: ({ id, ...body }: IFranchiseCreateUpdate) => {
      return axiosInstance.patch(`employee_endpoints/clinics/${id}`, body);
    },
    onSuccess: () => {
      customNotification({
        type: "success",
        message: "Франшиза успешно изменена!",
      });
      queryClient.invalidateQueries({ queryKey: ["franchiseData"] });
    },
  });

  const { mutate: onCreate, isPending: isCreateLoading } = useMutation({
    mutationKey: ["createFranchise"],
    mutationFn: (body: IFranchiseCreateUpdate) => {
      return axiosInstance.post(`employee_endpoints/clinics/`, body);
    },
    onSuccess: () => {
      customNotification({
        type: "success",
        message: "Франшиза успешно создана!",
      });
      queryClient.invalidateQueries({ queryKey: ["franchiseData"] });
    },
  });

  const { mutate: onDelete, isPending: isDeleteLoading } = useMutation({
    mutationKey: ["deleteFranchise"],
    mutationFn: (id: number) =>
      axiosInstance.delete(`employee_endpoints/clinics/${id}/`),
    onSuccess: () => {
      customNotification({
        type: "success",
        message: "Франшиза успешно удалена!",
      });
      queryClient.invalidateQueries({ queryKey: ["franchiseData"] });
      setPage(1);
    },
  });

  const { mutate: onPhotoCreateUpdate, isPending: isPhotoCreateUpdateLoading } =
    useMutation({
      mutationKey: ["createUpdatePhoto"],
      mutationFn: (body: any) => {
        const url = body.id
          ? `employee_endpoints/clinics/${body.branch}/photos/${body.id}/`
          : `employee_endpoints/clinics/${body.branch}/photos/add/`;
        return axiosInstance({
          method: body.id ? "patch" : "post",
          url,
          data: body,
        });
      },
      onSuccess: () => {
        customNotification({
          type: "success",
          message: `Фото успешно ${photoFormInitialFields.some((field) => field.name === "id" && field.value) ? "изменено" : "создано"}!`,
        });
        queryClient.invalidateQueries({
          queryKey: ["franchisePhotos", selectedBranchId],
        });
      },
    });

  const { mutate: onPhotoDelete, isPending: isPhotoDeleteLoading } =
    useMutation({
      mutationKey: ["deletePhoto"],
      mutationFn: ({
        branchId,
        photoId,
      }: {
        branchId: number;
        photoId: number;
      }) =>
        axiosInstance.delete(
          `employee_endpoints/clinics/${branchId}/photos/${photoId}/`,
        ),
      onSuccess: () => {
        customNotification({
          type: "success",
          message: "Фото успешно удалено!",
        });
        queryClient.invalidateQueries({
          queryKey: ["franchisePhotos", selectedBranchId],
        });
      },
    });

  const { data, isLoading } = useQuery({
    queryKey: ["franchiseData", addressId, page],
    queryFn: () =>
      axiosInstance
        .get<IFranchise[]>(`employee_endpoints/clinics/?page=${page}`)
        .then((response) => response?.data),
    enabled: !!addressId,
  });

  const { data: cities, isLoading: cityLoading } = useQuery({
    queryKey: ["cityData"],
    queryFn: () =>
      axiosInstance
        .get<CityTypes[]>(`patients_endpoints/cities/`)
        .then((response) => response?.data),
    refetchOnMount: false,
  });

  const { data: photos, isFetching: isPhotosLoading } = useQuery({
    queryKey: ["franchisePhotos", selectedBranchId],
    queryFn: () =>
      axiosInstance
        .get<
          IFranchisePhoto[]
        >(`employee_endpoints/clinics/${selectedBranchId}/photos/`)
        .then((response) => response?.data),
    enabled: !!selectedBranchId && photosDrawerOpen,
  });

  const onClose = () => {
    setCreateUpdateModalOpen(false);
    setCreateUpdateFormInitialFields(initialValues);
    setEditEntity(null);
    setFormType("");
  };

  const onClosePhotoModal = () => {
    setPhotoModalOpen(false);
    setPhotoFormInitialFields(photoInitialValues);
  };

  const onOpenCreateUpdateModal = (
    data: IFranchise | null,
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

  const onOpenPhotoModal = (
    branchId: number,
    photoData: any | null = null,
    type: ActionType,
  ) => {
    setSelectedBranchId(branchId);
    if (photoData) {
      setPhotoFormInitialFields(
        changeFormFieldsData<object>(photoInitialValues, photoData),
      );
      setPhotoEditEntity(photoData);
    } else {
      setPhotoFormInitialFields(photoInitialValues);
    }

    setPhotoModalOpen(true);
    setPhotoFormType(type);
  };

  const onSubmitCreateUpdateModal = async (
    formData: IFranchiseCreateUpdate,
  ) => {
    if (formType === "update") {
      const payload = {
        ...formData,
        id: editEntity?.id,
      };

      onUpdate(payload);
    } else {
      onCreate(formData);
    }

    onClose();
  };

  const onSubmitPhotoModal = async (formData: any) => {
    const payload = new FormData();
    if (selectedBranchId) {
      payload.append("doctor_profile", String(selectedBranchId));
    }
    payload.append("title_code", formData?.title_code || "");
    // payload.append("is_main", Boolean(formData.is_main));
    payload.append("photo", formData?.photo?.find((item: any) => item)?.originFileObj);
    if (photoFormType === "create") {
      payload.append("id", String(photoEditEntity?.id) || "");
    }
    onPhotoCreateUpdate(payload);
    onClosePhotoModal();
  };

  const handleDelete = (id: number) => {
    onDelete(id);
  };

  const handlePhotoDelete = (branchId: number, photoId: number) => {
    onPhotoDelete({ branchId, photoId });
  };

  const openPhotosDrawer = (branchId: number) => {
    setPhotosDrawerOpen(true);
    setSelectedBranchId(branchId);
  };

  const closePhotosDrawer = () => {
    setPhotosDrawerOpen(false);
  };

  const columns = [
    {
      title: "Идентификатор",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "Название",
      key: "title",
      dataIndex: "title",
    },
    {
      title: "Описание",
      key: "description",
      dataIndex: "description",
      render: (item: string) => (
        <ShowMoreContainer>
          <div
            style={{ width: 300 }}
            dangerouslySetInnerHTML={{ __html: item }}
          />
        </ShowMoreContainer>
      ),
    },
    {
      title: "Адрес",
      key: "address",
      dataIndex: "address",
    },
    {
      title: "Координаты",
      key: "coordinates",
      render: (location: IFranchise) => (
        <p>
          {formatCoordinates(
            Number(location.latitude),
            Number(location.longitude),
          )}
        </p>
      ),
    },
    {
      title: "Город",
      key: "city",
      dataIndex: "city",
      render: (item: number) => (
        <div>{cities?.find((el) => el.id === item)?.title}</div>
      ),
    },
    {
      title: "Редактировать",
      render: (data: IFranchise) => (
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
      render: (data: IFranchise) => (
        <Button
          onClick={() => handleDelete(data?.id as number)}
          disabled={isDeleteLoading}
        >
          Удалить
        </Button>
      ),
    },
    {
      title: "Фотографии",
      render: (data: IFranchise) => (
        <Button onClick={() => openPhotosDrawer(data.id)}>
          Просмотреть фото
        </Button>
      ),
    },
  ];

  const photoColumns = [
    {
      title: "ID",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "Фото",
      key: "photo",
      dataIndex: "photo",
      render: (photo: string) => (
        <img src={photo} alt="фото" style={{ width: "100px" }} />
      ),
    },
    {
      title: "Название",
      key: "title_code",
      dataIndex: "title_code",
    },
    {
      title: "Редактировать",
      render: (photo: IFranchisePhoto) => (
        <Button
          onClick={() =>
            onOpenPhotoModal(selectedBranchId as number, photo, "update")
          }
          type={"primary"}
        >
          Редактировать
        </Button>
      ),
    },
    {
      title: "Удалить",
      render: (photo: IFranchisePhoto) => (
        <Button
          onClick={() =>
            handlePhotoDelete(selectedBranchId as number, photo.id)
          }
          disabled={isPhotoDeleteLoading}
        >
          Удалить
        </Button>
      ),
    },
  ];

  return (
    <>
      <Drawer
        title={
          formType === "create" ? "Создание филиала" : "Редактирование филиала"
        }
        onClose={onClose}
        open={createUpdateModalOpen}
        width="500px"
      >
        <FranchiseCreateUpdateForm
          formType={formType}
          initialFields={createUpdateFormInitialFields}
          onSubmit={onSubmitCreateUpdateModal}
          onClose={onClose}
          isLoading={isUpdateLoading || isCreateLoading}
          cities={cities ?? []}
          cityLoading={cityLoading}
        />
      </Drawer>
      <Drawer
        title={
          photoFormInitialFields.some(
            (field) => field.name === "id" && field.value,
          )
            ? "Редактирование фото"
            : "Добавление фото"
        }
        onClose={onClosePhotoModal}
        open={photoModalOpen}
        width="600px"
      >
        <PhotoForm
          initialFields={photoFormInitialFields}
          onSubmit={onSubmitPhotoModal}
          onClose={onClosePhotoModal}
          isLoading={isPhotoCreateUpdateLoading}
        />
      </Drawer>
      <Drawer
        title="Фотографии"
        onClose={closePhotosDrawer}
        open={photosDrawerOpen}
        width="70%"
      >
        <div className={styles.action}>
          <Button
            onClick={() =>
              onOpenPhotoModal(selectedBranchId as number, null, "create")
            }
            type={"primary"}
            size={"large"}
          >
            Добавить фото
          </Button>
        </div>
        <CustomTable
          columns={photoColumns}
          dataSource={photos}
          loading={
            isPhotosLoading ||
            isPhotoCreateUpdateLoading ||
            isPhotoDeleteLoading
          }
        />
      </Drawer>
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
          dataSource={data ?? []}
          loading={isLoading}
          setPage={setPage}
          total={data?.length ?? 0}
          current={page}
        />
      </div>
    </>
  );
};

export default FranchisePage;
