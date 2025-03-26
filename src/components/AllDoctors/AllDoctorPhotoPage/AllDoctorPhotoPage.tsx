import styles from "./styles.module.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Modal } from "antd";
import { axiosInstance } from "../../../api";
import { customNotification } from "../../../utils/customNotification.ts";
import {
  ActionType,
  FormInitialFieldsParamsType,
} from "../../../types/common.ts";
import { changeFormFieldsData } from "../../../utils/changeFormFieldsData.ts";
import { CustomTable } from "../../Shared/CustomTable";
import { IFranchisePhoto } from "../../../types/franchiseTypes.ts";
import { useParams } from "react-router-dom";
import { PhotoForm } from "../../Franchise/PhotoForm/PhotoForm.tsx";

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

const DoctorWorkSchedulesPage = () => {
  const queryClient = useQueryClient();
  const pathname = useParams();

  const selectedDoctorId = pathname?.id;
  const [photoModalOpen, setPhotoModalOpen] = useState<boolean>(false);
  const [photoFormInitialFields, setPhotoFormInitialFields] =
    useState<FormInitialFieldsParamsType[]>(photoInitialValues);
  const [photoFormType, setPhotoFormType] = useState<ActionType>("");
  const [photoEditEntity, setPhotoEditEntity] =
    useState<IFranchisePhoto | null>(null);

  const { mutate: onPhotoCreateUpdate, isPending: isPhotoCreateUpdateLoading } =
    useMutation({
      mutationKey: ["createUpdatePhoto"],
      mutationFn: ({ doctor_profile, ...body }: any) => {
        const url = body.id
          ? `employee_endpoints/doctors/${doctor_profile}/doctor_profile_photos/${body?.id}/`
          : `employee_endpoints/doctors/${doctor_profile}/doctor_profile_photos/`;
        return axiosInstance({
          method: body.id ? "put" : "post",
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
      mutationFn: ({ photoId }: { photoId: number }) =>
        axiosInstance.delete(
          `employee_endpoints/doctors/${selectedDoctorId}/doctor_profile_photos/${photoId}/`,
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

  const { data: photos, isFetching: isPhotosLoading } = useQuery({
    queryKey: ["doctorPhotos", selectedDoctorId],
    queryFn: () =>
      axiosInstance
        .get<
          IFranchisePhoto[]
        >(`employee_endpoints/doctors/${selectedDoctorId}/doctor_profile_photos/`)
        .then((response) => response?.data),
    enabled: !!selectedDoctorId,
  });

  const onOpenPhotoModal = (photoData: any | null = null, type: ActionType) => {
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
      doctor_profile: selectedDoctorId,
      photo: formData?.photo?.find((item: any) => item)?.thumbUrl,
      title_code: formData?.title_code,
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

  const handlePhotoDelete = (photoId: number) => {
    onPhotoDelete({ photoId });
  };

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
          onClick={() => onOpenPhotoModal(photo, "update")}
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
          onClick={() => handlePhotoDelete(photo.id)}
          disabled={isPhotoDeleteLoading}
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
          photoFormInitialFields.some(
            (field) => field.name === "id" && field.value,
          )
            ? "Редактирование фото"
            : "Добавление фото"
        }
        footer={<></>}
        open={photoModalOpen}
        onCancel={() => setPhotoModalOpen(false)}
        width="80%"
      >
        <PhotoForm
          initialFields={photoFormInitialFields}
          onSubmit={onSubmitPhotoModal}
          onClose={() => setPhotoModalOpen(false)}
          isLoading={isPhotoCreateUpdateLoading}
        />
      </Modal>
      <div className={styles.container}>
        <div className={styles.action}>
          <Button
            onClick={() => onOpenPhotoModal(null, "create")}
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
      </div>
    </>
  );
};

export default DoctorWorkSchedulesPage;
