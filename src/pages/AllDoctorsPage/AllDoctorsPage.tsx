import {useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {CustomTable} from "../../components/Shared/CustomTable";
import {ActionType, FormInitialFieldsParamsType, IGet} from "../../types/common";
import {customNotification} from "../../utils/customNotification";
import {Button, Drawer} from "antd";
import {changeFormFieldsData} from "../../utils/changeFormFieldsData";
import {IAllDoctors, ICreateDoctors, IUpdateDoctors} from "../../types/allDoctors.ts";
import AllDoctorCreateUpdateForm
    from "../../components/AllDoctors/AllDoctorCreateUpdateForm/AllDoctorCreateUpdateForm.tsx";
import styles from './styles.module.scss';
import {datePickerFormatter, formatDateToString} from "../../utils/date/getDates.ts";
import AllDoctorAdditionalDataTable
    from "../../components/AllDoctors/AllDoctorAdditionalDataTable/AllDoctorAdditionalDataTable.tsx";
import {IDoctor} from "../../types/doctor.ts";
import {IFranchisePhoto} from "../../types/franchiseTypes.ts";
import {PhotoForm} from "../../components/Franchise/PhotoForm/PhotoForm.tsx";
import AllDoctorWorkSchedulesPage
    from "../../components/AllDoctors/AllDoctorWorkSchedulesPage/AllDoctorWorkSchedulesPage.tsx";

const initialValues: FormInitialFieldsParamsType[] = [
    {
        name: 'first_name',
        value: null,
    },
    {
        name: 'last_name',
        value: null,
    },
    {
        name: 'patronymic_name',
        value: null,
    },
    {
        name: 'description',
        value: null,
    },
    {
        name: 'city',
        value: null,
    },
    {
        name: 'category',
        value: null,
    },
    {
        name: 'gender',
        value: null,
    },
    {
        name: 'works_since',
        value: null,
    },
    {
        name: 'for_child',
        value: null,
    },
    {
        name: 'is_active',
        value: null,
    },
    {
        name: 'is_top',
        value: null,
    }
];

const photoInitialValues: FormInitialFieldsParamsType[] = [
    {
        name: 'branch',
        value: null,
    },
    {
        name: 'doctor_profile',
        value: null,
    },
    {
        name: 'photo',
        value: '',
    },
    {
        name: 'title_code',
        value: '',
    },
];

const AllDoctorsPage = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [createUpdateModalOpen, setCreateUpdateModalOpen] = useState<boolean>(false);
    const [editEntity, setEditEntity] = useState<IAllDoctors | null>(null);
    const [createUpdateFormInitialFields, setCreateUpdateFormInitialFields] = useState<FormInitialFieldsParamsType[]>(initialValues);
    const [formType, setFormType] = useState<ActionType>('');
    const [activeDoctor, setActiveDoctor] = useState<IAllDoctors | null>(null);
    const [isOpenSpecs, setIsOpenSpecs] = useState(false);

    const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

    const [photosDrawerOpen, setPhotosDrawerOpen] = useState<boolean>(false);
    const [photoFormType, setPhotoFormType] = useState<ActionType>('');
    const [photoEditEntity, setPhotoEditEntity] = useState<IFranchisePhoto | null>(null);
    const [photoModalOpen, setPhotoModalOpen] = useState<boolean>(false);
    const [photoFormInitialFields, setPhotoFormInitialFields] = useState<FormInitialFieldsParamsType[]>(photoInitialValues);

    const [scheduleModalOpen, setScheduleModalOpen] = useState<boolean>(false);


    const {
        mutate: onUpdate,
        isPending: isUpdateLoading,
    } = useMutation({
        mutationKey: ['updateDoctor'],
        mutationFn: ({ id, ...body }: IUpdateDoctors) => {
            return axiosInstance.put(`partners/franchise-info/all-doctors/${id}/`, body);
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Данные врача успешно обновлены!'
            });
            queryClient.invalidateQueries({ queryKey: ['doctorsData'] });
        },
    });

    const {
        mutate: onCreate,
        isPending: isCreateLoading,
    } = useMutation({
        mutationKey: ['createDoctor'],
        mutationFn: (body: ICreateDoctors) => {
            return axiosInstance.post(`partners/franchise-info/all-doctors/`, body);
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Врач успешно создан!'
            });
            queryClient.invalidateQueries({ queryKey: ['doctorsData'] });
        },
    });

    const {
        mutate: onDelete,
        isPending: isDeleteLoading,
    } = useMutation({
        mutationKey: ['deleteDoctor'],
        mutationFn: (id: number) =>
            axiosInstance.delete(`partners/franchise-info/all-doctors/${id}/`),
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Врач успешно удален!'
            });
            queryClient.invalidateQueries({ queryKey: ['doctorsData'] });
        }
    });

    const {
        mutate: onPhotoCreateUpdate,
        isPending: isPhotoCreateUpdateLoading,
    } = useMutation({
        mutationKey: ['createUpdatePhoto'],
        mutationFn: ({doctor_profile, ...body}: any) => {
            const url = body.id ?
                `partners/franchise-info/all-doctors/${doctor_profile}/doctor-photos/${body?.id}/` :
                `partners/franchise-info/all-doctors/${doctor_profile}/doctor-photos/`;
            return axiosInstance({
                method: body.id ? 'put' : 'post',
                url,
                data: body,
            });
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: `Фото успешно ${photoFormType === 'update' ? 'изменено' : 'создано'}!`
            });
            queryClient.invalidateQueries({ queryKey: ['doctorPhotos', selectedDoctorId] });
        },
    });

    const {
        mutate: onPhotoDelete,
        isPending: isPhotoDeleteLoading,
    } = useMutation({
        mutationKey: ['deletePhoto'],
        mutationFn: ({ doctorId, photoId }: { doctorId: number, photoId: number }) =>
            axiosInstance.delete(`partners/franchise-info/all-doctors/${doctorId}/doctor-photos/${photoId}/`),
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Фото успешно удалено!'
            });
            queryClient.invalidateQueries({ queryKey: ['doctorPhotos', selectedDoctorId] });
        }
    });

    const { data, isLoading } = useQuery({
        queryKey: ['doctorsData', page],
        queryFn: () =>
            axiosInstance
                .get<IGet<IAllDoctors>>(`partners/franchise-info/all-doctors/`)
                .then((response) => response?.data),
    });

    const { data: photos, isFetching: isPhotosLoading } = useQuery({
        queryKey: ['doctorPhotos', selectedDoctorId],
        queryFn: () =>
            axiosInstance
                .get<IFranchisePhoto[]>(`partners/franchise-info/all-doctors/${selectedDoctorId}/doctor-photos/`)
                .then((response) => response?.data),
        enabled: !!selectedDoctorId && photosDrawerOpen,
    });

    const onClose = () => {
        setCreateUpdateModalOpen(false);
        setCreateUpdateFormInitialFields(initialValues);
        setEditEntity(null);
        setFormType('');
    };

    const onOpenCreateUpdateModal = (data: IAllDoctors | null, type: ActionType) => {
        if (data && type === 'update') {
            setEditEntity(data);
            setCreateUpdateFormInitialFields(changeFormFieldsData(initialValues, {
                ...data,
                // @ts-ignore
                works_since: datePickerFormatter(data?.works_since ?? '')
            }))
        }

        setFormType(type);
        setCreateUpdateModalOpen(true);
    };

    const onSubmitCreateUpdateModal = async (formData: ICreateDoctors) => {
        if (formType === 'update') {
            const payload = {
                ...formData,
                id: editEntity?.id as number,
                // @ts-ignore
                works_since: formatDateToString(formData?.works_since?.$d ?? null) ?? ''
            };

            onUpdate(payload);
        } else {
            onCreate({
                ...formData,
                // @ts-ignore
                works_since: formatDateToString(formData?.works_since?.$d ?? null) ?? ''
            });
        }

        onClose();
    };

    const handleDelete = (id: number) => {
        onDelete(id);
    };

    const handleSpecsOpen = (doctor: IAllDoctors | null) => {
        setIsOpenSpecs(true)
        setActiveDoctor(doctor)
    }

    const handleSpecsClose = () => {
        setIsOpenSpecs(false)
        setActiveDoctor(null)
    }

    const openPhotosDrawer = (doctorId: number) => {
        setPhotosDrawerOpen(true);
        setSelectedDoctorId(doctorId);
    };

    const openSchedule = (doctorId: number) => {
        setSelectedDoctorId(doctorId);
        setScheduleModalOpen(true)
    };

    const closePhotosDrawer = () => {
        setPhotosDrawerOpen(false);
    };

    const onOpenPhotoModal = (doctorId: number, photoData: any | null = null, type: ActionType) => {
        setSelectedDoctorId(doctorId);
        if (photoData) {
            setPhotoFormInitialFields(changeFormFieldsData<object>(photoInitialValues, photoData));
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
            title_code: formData?.title_code
        };
        console.log(payload, 'PAYLOAAD')
        onPhotoCreateUpdate(photoFormType === 'create' ? payload : {
            id: photoEditEntity?.id,
            ...payload
        });
        setPhotoModalOpen(false);
    };

    const handlePhotoDelete = (doctorId: number, photoId: number) => {
        onPhotoDelete({ doctorId, photoId });
    };

    const columns = [
        {
            title: 'Фото',
            key: 'latest_photo',
            dataIndex: 'latest_photo',
            render: (photo: string) => <img src={photo} alt="doctor" style={{ width: 50, height: 50 }} />,
        },
        {
            title: 'ФИО',
            key: 'full_name',
            dataIndex: 'full_name',
        },
        {
            title: 'Категория',
            key: 'category',
            dataIndex: 'category',
        },
        {
            title: 'Город',
            key: 'city',
            dataIndex: 'city',
        },
        {
            title: 'Специализации',
            key: 'specialities',
            dataIndex: 'specialities',
            render: (specialities: string[]) => specialities.join(', '),
        },
        {
            title: 'Процедуры',
            key: 'procedures',
            dataIndex: 'procedures',
            render: (procedures: string[]) => procedures.join(', '),
        },
        {
            title: 'Опыт (лет)',
            key: 'experience_years',
            dataIndex: 'experience_years',
        },
        {
            title: 'Рейтинг',
            key: 'rating',
            dataIndex: 'rating',
        },
        {
            title: 'Филиалы клиник',
            key: 'clinic_branches',
            dataIndex: 'clinic_branches',
            render: (branches: string[]) => branches.join(', '),
        },
        {
            title: 'Редактировать',
            render: (data: IAllDoctors) => <Button
                onClick={() => onOpenCreateUpdateModal(data, 'update')}
                type={"primary"}
            >
                Редактировать
            </Button>
        },
        {
            title: 'Специальности',
            key: 'action',
            render: (item: IAllDoctors) => (
                <Button
                    onClick={() => handleSpecsOpen(item)}
                >
                    Специальности
                </Button>
            ),
        },
        {
            title: 'Фотографии',
            render: (data: IDoctor) => (
                <Button onClick={() => openPhotosDrawer(data.id)}>
                    Фотографии
                </Button>
            )
        },
        {
            title: 'Расписание',
            render: (data: IDoctor) => (
                <Button onClick={() => openSchedule(data.id)}>
                    Расписание
                </Button>
            )
        },
        {
            title: 'Удалить',
            render: (data: IAllDoctors) => <Button
                onClick={() => handleDelete(data?.id as number)}
                disabled={isDeleteLoading}
            >
                Удалить
            </Button>
        },
    ];

    const photoColumns = [
        {
            title: 'ID',
            key: 'id',
            dataIndex: 'id',
        },
        {
            title: 'Фото',
            key: 'photo',
            dataIndex: 'photo',
            render: (photo: string) => <img src={photo} alt="фото" style={{ width: '100px' }} />,
        },
        {
            title: 'Название',
            key: 'title_code',
            dataIndex: 'title_code',
        },
        {
            title: 'Редактировать',
            render: (photo: IFranchisePhoto) => <Button
                onClick={() => onOpenPhotoModal(selectedDoctorId as number, photo, 'update')}
                type={"primary"}
            >
                Редактировать
            </Button>
        },
        {
            title: 'Удалить',
            render: (photo: IFranchisePhoto) => <Button
                onClick={() => handlePhotoDelete(selectedDoctorId as number, photo.id)}
                disabled={isPhotoDeleteLoading}
            >
                Удалить
            </Button>
        },
    ];

    return (
        <>
            <Drawer
                title={photoFormInitialFields.some(field => field.name === 'id' && field.value) ? 'Редактирование фото' : 'Добавление фото'}
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
                title={'Расписание врача'}
                onClose={() => setScheduleModalOpen(false)}
                open={scheduleModalOpen}
                width={'90%'}
            >
                <AllDoctorWorkSchedulesPage doctorId={selectedDoctorId as number}/>
            </Drawer>
            <Drawer
                title="Фотографии"
                onClose={closePhotosDrawer}
                open={photosDrawerOpen}
                width="600px"
            >
                <div className={styles.action}>
                    <Button
                        onClick={() => onOpenPhotoModal(selectedDoctorId as number, null, 'create')}
                        type={"primary"}
                        size={"large"}
                    >
                        Добавить фото
                    </Button>
                </div>
                <CustomTable
                    columns={photoColumns}
                    dataSource={photos}
                    loading={isPhotosLoading || isPhotoCreateUpdateLoading || isPhotoDeleteLoading}
                />
            </Drawer>
            <Drawer
                title={formType === 'create' ? 'Создание врача' : 'Редактирование врача'}
                onClose={onClose}
                open={createUpdateModalOpen}
                width="500px"
            >
                <AllDoctorCreateUpdateForm
                    formType={formType}
                    initialFields={createUpdateFormInitialFields}
                    onSubmit={onSubmitCreateUpdateModal}
                    onClose={onClose}
                    isLoading={isUpdateLoading || isCreateLoading}
                />
            </Drawer>
            <Drawer
                title={`Выбранный врач: ${activeDoctor?.full_name}`}
                onClose={handleSpecsClose}
                open={isOpenSpecs}
                width={'90%'}
            >
                <AllDoctorAdditionalDataTable doctorDetails={activeDoctor}/>
            </Drawer>
            <div className={styles.container}>
                <div className={styles.action}>
                    <Button
                        onClick={() => onOpenCreateUpdateModal(null, 'create')}
                        type={'primary'}
                        size={"large"}
                    >
                        Создать
                    </Button>
                </div>
                <CustomTable
                    columns={columns}
                    dataSource={data?.results}
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

export default AllDoctorsPage;
