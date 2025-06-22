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
import { IAmenityResponce } from "../../types/amenityTypes.ts";
import { AmenityCreateUpdateForm } from "../../components/Amenity/AmenityCreateUpdateForm/AmenityCreateUpdateForm.tsx";

const initialValues: FormInitialFieldsParamsType[] = [
  {
    name: "title",
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
  {
    name: "yandex_maps_url",
    value: "",
  },
  {
    name: "google_maps_url",
    value: "",
  },
  {
    name: "two_gis_url",
    value: "",
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

const amenityInitialValues: FormInitialFieldsParamsType[] = [
  {
    name: 'amenity',
    value: null,
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

  // Состояния для управления удобствами
  const [amenitiesDrawerOpen, setAmenitiesDrawerOpen] = useState<boolean>(false);
  const [amenityModalOpen, setAmenityModalOpen] = useState<boolean>(false);
  const [amenityFormInitialFields, setAmenityFormInitialFields] =
      useState<FormInitialFieldsParamsType[]>(amenityInitialValues);
  const [amenityFormType, setAmenityFormType] = useState<ActionType>("");
  const [amenityEditEntity, setAmenityEditEntity] =
      useState<IAmenityResponce | null>(null);
  const [amenityPage, setAmenityPage] = useState(1);
  const [selectedFranchise, setSelectedFranchise] = useState<IFranchise | null>(null);

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
              ? `employee_endpoints/clinics/${selectedBranchId}/photos/${body.id}/`
              : `employee_endpoints/clinics/${selectedBranchId}/photos/add/`;
          return axiosInstance({
            method: body.id ? "patch" : "post",
            url,
            data: body,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
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
                       photoId,
                     }: {
          branchId: number;
          photoId: number;
        }) =>
            axiosInstance.delete(
                `employee_endpoints/clinics/${selectedBranchId}/photos/${photoId}/`,
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

  // Мутации для управления удобствами
  const { mutate: onAmenityUpdate, isPending: isAmenityUpdateLoading } = useMutation({
    mutationKey: ['updateAmenity'],
    mutationFn: ({ amenity }: {amenity: number}) => {
      return axiosInstance.put(`employee_endpoints/clinics/${selectedBranchId}/amenities/${amenityEditEntity?.id}/`, { amenity });
    },
    onSuccess: () => {
      customNotification({
        type: 'success',
        message: 'Удобство успешно изменено!'
      });
      queryClient.invalidateQueries({ queryKey: ['franchiseAmenities', selectedBranchId] });
    },
  });

  const { mutate: onAmenityCreate, isPending: isAmenityCreateLoading } = useMutation({
    mutationKey: ['createAmenity'],
    mutationFn: (body: {amenity: number}) => {
      return axiosInstance.post(`employee_endpoints/clinics/${selectedBranchId}/amenities/`, body);
    },
    onSuccess: () => {
      customNotification({
        type: 'success',
        message: 'Удобство успешно создано!'
      });
      queryClient.invalidateQueries({ queryKey: ['franchiseAmenities', selectedBranchId] });
    },
  });

  const { mutate: onAmenityDelete, isPending: isAmenityDeleteLoading } = useMutation({
    mutationKey: ['deleteAmenity'],
    mutationFn: (id: number) =>
        axiosInstance.delete(`employee_endpoints/clinics/${selectedBranchId}/amenities/${id}/`),
    onSuccess: () => {
      customNotification({
        type: 'success',
        message: 'Удобство успешно удалено!'
      });
      queryClient.invalidateQueries({ queryKey: ['franchiseAmenities', selectedBranchId] });
    }
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

  // Запрос для получения удобств франшизы
  const { data: amenities, isLoading: isAmenitiesLoading } = useQuery({
    queryKey: ['franchiseAmenities', selectedBranchId, amenityPage],
    queryFn: () =>
        axiosInstance
            .get<IAmenityResponce[]>(`employee_endpoints/clinics/${selectedBranchId}/amenities/?page=${amenityPage}`)
            .then((response) => response?.data),
    enabled: !!selectedBranchId && amenitiesDrawerOpen
  });

  // Запрос для получения всех удобств города
  const { data: allAmenities, isLoading: allAmenitiesLoading } = useQuery({
    queryKey: ['allAmenities', selectedFranchise?.city],
    queryFn: () =>
        axiosInstance
            .get<Array<{id: number, title: string}>>(`patients_endpoints/clinics/city_id:${selectedFranchise?.city}/all-amenities-in-the-city/`)
            .then((response) => response?.data),
    enabled: !!selectedFranchise?.city && amenityModalOpen
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

  const onCloseAmenityModal = () => {
    setAmenityModalOpen(false);
    setAmenityFormInitialFields(amenityInitialValues);
    setAmenityEditEntity(null);
    setAmenityFormType("");
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

  const onOpenAmenityModal = (data: IAmenityResponce | null, type: ActionType) => {
    if (data && type === 'update') {
      setAmenityEditEntity(data);
      // Для редактирования устанавливаем ID удобства
      setAmenityFormInitialFields([
        {
          name: 'amenity',
          value: data.amenity?.id || null
        }
      ]);
    } else {
      // Для создания сбрасываем форму
      setAmenityFormInitialFields(amenityInitialValues);
    }

    setAmenityFormType(type);
    setAmenityModalOpen(true);
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
      // payload.append("doctor_profile", String(selectedBranchId));
    }
    payload.append("title_code", formData?.title_code || "");
    // payload.append("is_main", Boolean(formData.is_main));
    payload.append("photo", formData?.photo?.find((item: any) => item)?.originFileObj);
    payload.append("is_main", formData?.is_main || false);
    if (photoFormType === "create") {
      payload.append("id", String(photoEditEntity?.id) || "");
    }
    onPhotoCreateUpdate(payload);
    onClosePhotoModal();
  };

  const onSubmitAmenityModal = async (formData: {amenity: number}) => {
    if (amenityFormType === 'update') {
      onAmenityUpdate(formData);
    } else {
      onAmenityCreate(formData);
    }

    onCloseAmenityModal();
  };

  const handleDelete = (id: number) => {
    onDelete(id);
  };

  const handlePhotoDelete = (branchId: number, photoId: number) => {
    onPhotoDelete({ branchId, photoId });
  };

  const handleAmenityDelete = (id: number) => {
    onAmenityDelete(id);
  };

  const openPhotosDrawer = (branchId: number) => {
    setPhotosDrawerOpen(true);
    setSelectedBranchId(branchId);
  };

  const closePhotosDrawer = () => {
    setPhotosDrawerOpen(false);
  };

  const openAmenitiesDrawer = (branchId: number) => {
    setAmenitiesDrawerOpen(true);
    setSelectedBranchId(branchId);
    // Найти выбранную франшизу для получения city_id
    const franchise = data?.find(item => item.id === branchId);
    setSelectedFranchise(franchise || null);
  };

  const closeAmenitiesDrawer = () => {
    setAmenitiesDrawerOpen(false);
    setAmenityPage(1);
    setSelectedFranchise(null);
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
      title: "Слаг",
      key: "slug",
      dataIndex: "slug",
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
    {
      title: "Удобства",
      render: (data: IFranchise) => (
          <Button onClick={() => openAmenitiesDrawer(data.id)}>
            Управление удобствами
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

  const amenityColumns = [
    {
      title: 'Идентификатор',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: 'Название удобства',
      key: 'amenity',
      dataIndex: 'amenity',
      render: (data: {title: string}) => (data?.title)
    },
    // {
    //   title: 'Редактировать',
    //   render: (data: IAmenityResponce) => <Button
    //       onClick={() => onOpenAmenityModal(data, 'update')}
    //       type={"primary"}
    //   >
    //     Редактировать
    //   </Button>
    // },
    {
      title: 'Удалить',
      render: (data: IAmenityResponce) => <Button
          onClick={() => handleAmenityDelete(data?.amenity?.id as number)}
          disabled={isAmenityDeleteLoading}
      >
        Удалить
      </Button>
    },
  ];

  return (
      <>
        {/* Drawer для создания/редактирования франшизы */}
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

        {/* Drawer для создания/редактирования фото */}
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

        {/* Drawer для просмотра фотографий */}
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

        {/* Drawer для создания/редактирования удобства */}
        <Drawer
            title={amenityFormType === 'create' ? 'Создание удобства' : 'Редактирование удобства'}
            onClose={onCloseAmenityModal}
            open={amenityModalOpen}
            width="500px"
        >
          <AmenityCreateUpdateForm
              formType={amenityFormType}
              initialFields={amenityFormInitialFields}
              onSubmit={onSubmitAmenityModal}
              onClose={onCloseAmenityModal}
              isLoading={isAmenityUpdateLoading || isAmenityCreateLoading}
              allAmenities={allAmenities || []}
              amenitiesLoading={allAmenitiesLoading}
          />
        </Drawer>

        {/* Drawer для управления удобствами */}
        <Drawer
            title="Управление удобствами"
            onClose={closeAmenitiesDrawer}
            open={amenitiesDrawerOpen}
            width="70%"
        >
          <div className={styles.action}>
            <Button
                onClick={() => onOpenAmenityModal(null, 'create')}
                type={'primary'}
                size={"large"}
            >
              Создать удобство
            </Button>
          </div>
          <CustomTable
              columns={amenityColumns}
              dataSource={amenities}
              loading={isAmenitiesLoading || isAmenityCreateLoading || isAmenityUpdateLoading || isAmenityDeleteLoading}
              setPage={setAmenityPage}
              pagination={false}
              current={amenityPage}
              total={amenities?.length ?? 0}
          />
        </Drawer>

        {/* Основной контент */}
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
