import { CustomTable } from "../../components/Shared/CustomTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../api";
import { useStateContext } from "../../contexts";
import {
  ICreateUpdateDoctor,
  IDoctor,
  IDoctorPhotoCreate,
  IDoctorPhotoUpdate,
  Speciality,
} from "../../types/doctor.ts";
import { useState } from "react";
import { DoctorProfile } from "../../components/Doctors/DoctorProfile/DoctorProfile.tsx";
import { ActionType, FormInitialFieldsParamsType } from "../../types/common.ts";
import { Button, Drawer } from "antd";
import { useNavigate } from "react-router-dom";
import { objectToQueryParams } from "../../utils/objectToQueryParams.ts";
import { DoctorCreateForm } from "../../components/Doctors/DoctorCreateForm/DoctorCreateForm.tsx";
import { customNotification } from "../../utils/customNotification.ts";
import styles from "./styles.module.scss";
import { formatDateToString } from "../../utils/date/getDates.ts";
import { PhotoForm } from "../../components/Franchise/PhotoForm/PhotoForm.tsx";
import { IFranchisePhoto } from "../../types/franchiseTypes.ts";
import { changeFormFieldsData } from "../../utils/changeFormFieldsData.ts";

const initialValues: FormInitialFieldsParamsType[] = [
  {
    name: "first_name",
    value: "",
  },
  {
    name: "last_name",
    value: "",
  },
  {
    name: "patronymic_name",
    value: "",
  },
  {
    name: "description",
    value: "",
  },
  {
    name: "category",
    value: null,
  },
  {
    name: "gender",
    value: null,
  },
  {
    name: "works_since",
    value: "",
  },
  {
    name: "for_child",
    value: false,
  },
  {
    name: "is_active",
    value: false,
  },
];

const photoInitialValues: FormInitialFieldsParamsType[] = [
  {
    name: "branch",
    value: null,
  },
  {
    name: "doctor_profile",
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
];

const DoctorsPage = () => {
  const queryClient = useQueryClient();
  const { state } = useStateContext();
  const navigate = useNavigate();
  const { addressId, doctor } = state;
  const { query } = doctor;

  const [page, setPage] = useState(1);
  const [createUpdateModalOpen, setCreateUpdateModalOpen] =
    useState<boolean>(false);
  const [createUpdateFormInitialFields, setCreateUpdateFormInitialFields] =
    useState<FormInitialFieldsParamsType[]>(initialValues);
  const [photoModalOpen, setPhotoModalOpen] = useState<boolean>(false);
  const [photoFormInitialFields, setPhotoFormInitialFields] =
    useState<FormInitialFieldsParamsType[]>(photoInitialValues);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [photosDrawerOpen, setPhotosDrawerOpen] = useState<boolean>(false);
  const [photoFormType, setPhotoFormType] = useState<ActionType>("");
  const [photoEditEntity, setPhotoEditEntity] =
    useState<IFranchisePhoto | null>(null);

  const { mutate: onCreate, isPending: isCreateLoading } = useMutation({
    mutationKey: ["createDoctor"],
    mutationFn: (body: ICreateUpdateDoctor) => {
      return axiosInstance.post(
        `employee_endpoints/clinics/${addressId}/doctors/`,
        body,
      );
    },
    onSuccess: () => {
      customNotification({
        type: "success",
        message: "Врач успешно создан!",
      });
      queryClient.invalidateQueries({ queryKey: ["doctorsData"] });
    },
  });

  const { mutate: onDeleteDoctor, isPending: isDeleteLoading } = useMutation({
    mutationKey: ["deleteDoctor"],
    mutationFn: (id: number) =>
      axiosInstance.delete(
        `partners/franchise-branches/${addressId}/doctors/${id}/`,
      ),
    onSuccess: () => {
      customNotification({
        type: "success",
        message: "Врач успешно удален!",
      });
      queryClient.invalidateQueries({ queryKey: ["doctorsData"] });
    },
  });

  const { mutate: onPhotoCreateUpdate, isPending: isPhotoCreateUpdateLoading } =
    useMutation({
      mutationKey: ["createUpdatePhoto"],
      mutationFn: (body: IDoctorPhotoCreate | IDoctorPhotoUpdate) => {
        const url = body.id
          ? `employee_endpoints/doctors/${selectedDoctorId}/doctor_profile_photos/${body?.id}/`
          : `employee_endpoints/doctors/${selectedDoctorId}/doctor_profile_photos/`;
        const method = body.id ? "patch" : "post";
        if (body.id) {
          delete body.id;
        }
        return axiosInstance({
          method,
          url,
          data: body,
        });
      },
      onSuccess: () => {
        customNotification({
          type: "success",
          message: `Фото успешно ${photoFormType === "update" ? "изменено" : "создано"}!`,
        });
        queryClient.invalidateQueries({
          queryKey: ["doctorPhotos", selectedDoctorId],
        });
      },
    });

  const { mutate: onPhotoDelete, isPending: isPhotoDeleteLoading } =
    useMutation({
      mutationKey: ["deletePhoto"],
      mutationFn: ({
        doctorId,
        photoId,
      }: {
        doctorId: number;
        photoId: number;
      }) =>
        axiosInstance.delete(
          `employee_endpoints/doctors/${doctorId}/doctor_profile_photos/${photoId}/`,
        ),
      onSuccess: () => {
        customNotification({
          type: "success",
          message: "Фото успешно удалено!",
        });
        queryClient.invalidateQueries({
          queryKey: ["doctorPhotos", selectedDoctorId],
        });
      },
    });

  const { data, isFetching: isLoading } = useQuery({
    queryKey: ["doctorsData", addressId, page, query],
    queryFn: () =>
      axiosInstance
        .get<IDoctor[]>(
          `employee_endpoints/clinics/${addressId}/doctors/?page=${page}&${objectToQueryParams(
            {
              part_of_name: query,
            },
          )}`,
        )
        .then((response) => response?.data),
    enabled: !!addressId,
  });

  const { data: photos, isFetching: isPhotosLoading } = useQuery({
    queryKey: ["doctorPhotos", selectedDoctorId],
    queryFn: () =>
      axiosInstance
        .get<
          IFranchisePhoto[]
        >(`employee_endpoints/doctors/${selectedDoctorId}/doctor_profile_photos/`)
        .then((response) => response?.data),
    enabled: !!selectedDoctorId && photosDrawerOpen,
  });

  const handleGoEditPage = (doctorDetails: IDoctor) => {
    navigate(`/doctor/${doctorDetails?.id}`);
  };

  const handleDeleteDoctor = (id: number) => {
    onDeleteDoctor(id);
  };

  const openPhotosDrawer = (branchId: number, doctorId: number) => {
    setPhotosDrawerOpen(true);
    setSelectedBranchId(branchId);
    setSelectedDoctorId(doctorId);
  };

  const closePhotosDrawer = () => {
    setPhotosDrawerOpen(false);
  };

  const onOpenPhotoModal = (
    branchId: number,
    doctorId: number,
    photoData: any | null = null,
    type: ActionType,
  ) => {
    setSelectedBranchId(branchId);
    setSelectedDoctorId(doctorId);
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

  const onSubmitPhotoModal = async (formData: any) => {
    const payload = {
      photo: formData?.photo?.find((item: any) => item)?.thumbUrl,
      title_code: formData?.title_code,
      is_main: formData?.is_main,
    };
    console.log(payload, "PAYLOAAD");
    onPhotoCreateUpdate(
      photoFormType === "create"
        ? payload
        : {
            id: photoEditEntity?.id,
            ...payload,
          },
    );
    setPhotoModalOpen(false);
  };

  const handlePhotoDelete = (doctorId: number, photoId: number) => {
    onPhotoDelete({ doctorId, photoId });
  };

  const columns = [
    // {
    //   title: "",
    //   dataIndex: "count",
    //   key: "count",
    // },
    {
      title: "Врач",
      dataIndex: "full_name",
      key: "full_name",
      render: (name: string) => <DoctorProfile title={name} imgSrc={""} />,
    },
    {
      title: "Специальности/Процедуры",
      key: "specialities",
      dataIndex: "specialities",
      render: (data: Speciality[]) => (
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <div>
            {data?.map((item, index) => {
              return `${item?.medical_speciality_title}${index === data?.length - 1 ? "" : ","} `;
            })}
          </div>
        </div>
      ),
    },
    {
      title: "Опубликован",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active: boolean) => <p>{is_active ? "Да" : "Нет"}</p>,
    },
    {
      title: "Редактировать",
      render: (data: IDoctor) => (
        <Button onClick={() => handleGoEditPage(data)} type={"primary"}>
          Редактировать
        </Button>
      ),
    },
    {
      title: "Удалить",
      render: (data: IDoctor) => (
        <Button
          onClick={() => handleDeleteDoctor(data?.id as number)}
          disabled={isDeleteLoading}
        >
          Удалить
        </Button>
      ),
    },
    {
      title: "Фотографии",
      render: (data: IDoctor) => (
        <Button onClick={() => openPhotosDrawer(addressId as number, data.id)}>
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
            onOpenPhotoModal(
              selectedBranchId as number,
              selectedDoctorId as number,
              photo,
              "update",
            )
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
            handlePhotoDelete(selectedDoctorId as number, photo.id)
          }
          disabled={isPhotoDeleteLoading}
        >
          Удалить
        </Button>
      ),
    },
  ];

  const onClose = () => {
    setCreateUpdateModalOpen(false);
    setCreateUpdateFormInitialFields(initialValues);
  };

  const onOpenCreateUpdateModal = () => {
    setCreateUpdateModalOpen(true);
  };

  const onSubmitCreateUpdateModal = async (formData: ICreateUpdateDoctor) => {
    const payload = {
      ...formData,
      works_since: formatDateToString(formData?.works_since?.$d) ?? "",
    };
    onCreate(payload);
    onClose();
  };

  return (
    <>
      <Drawer
        title={"Создание врача"}
        onClose={onClose}
        open={createUpdateModalOpen}
        width="500px"
      >
        <DoctorCreateForm
          formType={"create"}
          initialFields={createUpdateFormInitialFields}
          onSubmit={onSubmitCreateUpdateModal}
          onClose={onClose}
          isLoading={isCreateLoading}
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
        onClose={() => setPhotoModalOpen(false)}
        open={photoModalOpen}
        width="500px"
      >
        <PhotoForm
          initialFields={photoFormInitialFields}
          onSubmit={onSubmitPhotoModal}
          onClose={() => setPhotoModalOpen(false)}
          isLoading={isPhotoCreateUpdateLoading}
        />
      </Drawer>
      <Drawer
        title="Фотографии"
        onClose={closePhotosDrawer}
        open={photosDrawerOpen}
        width="600px"
      >
        <div className={styles.action}>
          <Button
            onClick={() =>
              onOpenPhotoModal(
                selectedBranchId as number,
                selectedDoctorId as number,
                null,
                "create",
              )
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
            onClick={onOpenCreateUpdateModal}
            type={"primary"}
            size={"large"}
          >
            Создать
          </Button>
        </div>
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

export default DoctorsPage;
