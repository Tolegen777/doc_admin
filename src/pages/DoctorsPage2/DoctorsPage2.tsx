import {CustomTable} from "../../components/Shared/CustomTable";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {IDoctor} from "../../types/doctor.ts";
import {useState} from "react";
import {ActionType, FormInitialFieldsParamsType, IGet} from "../../types/common.ts";
import {Button, Drawer, Tag} from "antd";
import {useNavigate} from "react-router-dom";
import {DoctorCreateForm} from "../../components/Doctors/DoctorCreateForm/DoctorCreateForm.tsx";
import {customNotification} from "../../utils/customNotification.ts";
import styles from './styles.module.scss';
import {formatDateToString} from "../../utils/date/getDates.ts";
import {PhotoForm} from "../../components/Franchise/PhotoForm/PhotoForm.tsx";
import {IFranchise, IFranchisePhoto} from "../../types/franchiseTypes.ts";
import {changeFormFieldsData} from "../../utils/changeFormFieldsData.ts";
import {IAllDoctors, ICategory2, ICreateDoctors} from "../../types/allDoctors.ts";
import {IAllSpec} from "../../types/doctorSpec.ts";
import {selectOptionsParser} from "../../utils/selectOptionsParser.ts";
import ShowMoreContainer from "../../components/Shared/ShowMoreContainer/ShowMoreContainer.tsx";
import {objectToQueryParams} from "../../utils/objectToQueryParams.ts";
import AllDoctorsFilter from "../../components/AllDoctors/AllDoctorsFilter/AllDoctorsFilter.tsx";
import AllDoctorWorkSchedulesPage
    from "../../components/AllDoctors/AllDoctorWorkSchedulesPage/AllDoctorWorkSchedulesPage.tsx";

const initialValues: FormInitialFieldsParamsType[] = [
    {
        name: 'first_name',
        value: '',
    },
    {
        name: 'last_name',
        value: '',
    },
    {
        name: 'patronymic_name',
        value: '',
    },
    {
        name: 'description',
        value: '',
    },
    {
        name: 'categories',
        value: [],
    },
    {
        name: 'city',
        value: null,
    },
    {
        name: 'gender',
        value: null,
    },
    {
        name: 'works_since',
        value: '',
    },
    {
        name: 'for_child',
        value: false,
    },
    {
        name: 'is_active',
        value: false,
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

const DoctorsPage2 = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [createUpdateModalOpen, setCreateUpdateModalOpen] = useState<boolean>(false);
    const [createUpdateFormInitialFields, setCreateUpdateFormInitialFields] = useState<FormInitialFieldsParamsType[]>(initialValues);
    const [photoModalOpen, setPhotoModalOpen] = useState<boolean>(false);
    const [photoFormInitialFields, setPhotoFormInitialFields] = useState<FormInitialFieldsParamsType[]>(photoInitialValues);
    const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
    const [photosDrawerOpen, setPhotosDrawerOpen] = useState<boolean>(false);
    const [photoFormType, setPhotoFormType] = useState<ActionType>('');
    const [photoEditEntity, setPhotoEditEntity] = useState<IFranchisePhoto | null>(null);

    const [params, setParams] = useState<string>('');

    const [scheduleModalOpen, setScheduleModalOpen] = useState<boolean>(false);

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
            queryClient.invalidateQueries({queryKey: ['doctorsData']});
        },
    });

    const {
        mutate: onDeleteDoctor,
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
            queryClient.invalidateQueries({queryKey: ['doctorsData']});
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
            queryClient.invalidateQueries({queryKey: ['doctorPhotos', selectedDoctorId]});
        },
    });

    const {
        mutate: onPhotoDelete,
        isPending: isPhotoDeleteLoading,
    } = useMutation({
        mutationKey: ['deletePhoto'],
        mutationFn: ({doctorId, photoId}: { doctorId: number, photoId: number }) =>
            axiosInstance.delete(`partners/franchise-info/all-doctors/${doctorId}/doctor-photos/${photoId}/`),
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Фото успешно удалено!'
            });
            queryClient.invalidateQueries({queryKey: ['doctorPhotos', selectedDoctorId]});
        }
    });

    const {data, isLoading} = useQuery({
        queryKey: ['doctorsData', page, params],
        queryFn: () =>
            axiosInstance
                .get<IGet<IAllDoctors>>(`partners/franchise-info/all-doctors/?page=${page}${params}`)
                .then((response) => response?.data),
    });

    const {data: photos, isFetching: isPhotosLoading} = useQuery({
        queryKey: ['doctorPhotos', selectedDoctorId],
        queryFn: () =>
            axiosInstance
                .get<IFranchisePhoto[]>(`partners/franchise-info/all-doctors/${selectedDoctorId}/doctor-photos/`)
                .then((response) => response?.data),
        enabled: !!selectedDoctorId && photosDrawerOpen,
    });

    const {data: clinics, isLoading: clinicsLoading} = useQuery({
        queryKey: ['franchiseBranches'],
        queryFn: () =>
            axiosInstance
                .get<IGet<IFranchise>>('partners/franchise-branches/?page_size=100')
                .then((response) => response.data),
        refetchOnMount: false,
    });

    const {data: cities, isLoading: citiesLoading} = useQuery({
        queryKey: ['doctorCitiesData'],
        queryFn: () =>
            axiosInstance
                .get('patients/cities/')
                .then((response) => response.data),
        refetchOnMount: false,
    });

    const {data: allSpecsList, isLoading: allSpecLoading} = useQuery({
        queryKey: ['allSpecsList',],
        queryFn: () =>
            axiosInstance
                .get<IAllSpec[]>(`partners/medical-specialties-list/`)
                .then((response) => response?.data),
    });

    const {data: categories, isLoading: categoryLoading} = useQuery({
        queryKey: ['doctorCategoriesData'],
        queryFn: () =>
            axiosInstance
                .get('partners/doctor-categories/')
                .then((response) => response.data),
        refetchOnMount: false,
    });

    const clinicOptions = selectOptionsParser(clinics?.results ?? [], 'title', 'id')
    const cityOptions = selectOptionsParser(cities ?? [], 'title', 'id')
    const specOptions = selectOptionsParser(allSpecsList ?? [], 'medical_speciality_title', 'medical_speciality_id')
    const categoryOptions = selectOptionsParser(categories ?? [], 'title', 'doctor_category_id')

    const handleGoEditPage = (doctorDetails: IAllDoctors) => {
        navigate(`/all-doctors/${doctorDetails?.id}`);
    };

    const handleDelete = (id: number) => {
        onDeleteDoctor(id);
    };

    const openPhotosDrawer = (doctorId: number) => {
        setPhotosDrawerOpen(true);
        setSelectedDoctorId(doctorId);
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

    const onClose = () => {
        setCreateUpdateModalOpen(false);
        setCreateUpdateFormInitialFields(initialValues);
    };

    // const onOpenCreateUpdateModal = () => {
    //     setCreateUpdateModalOpen(true);
    // };

    const onSubmitCreateUpdateModal = async (formData: ICreateDoctors) => {
        const payload = {
            ...formData,
            // @ts-ignore
            works_since: formatDateToString(formData?.works_since?.$d) ?? '',
        };
        onCreate(payload);
        onClose();
    };

    const handleFilter = (formData: any) => {
        if (formData) {
            console.log(formData, 'FROM')
            const urlParams = objectToQueryParams(formData)
            console.log(urlParams, 'PAR')
            setParams(`&${urlParams}`)
        }
    }

    const openSchedule = (doctorId: number) => {
        setSelectedDoctorId(doctorId);
        setScheduleModalOpen(true)
    };

    const columns = [
        {
            title: 'Фото',
            key: 'latest_photo',
            dataIndex: 'latest_photo',
            render: (photo: string) => <img src={photo} alt="doctor" style={{width: 50, height: 50}}/>,
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
            title: 'Категорий',
            key: 'categories',
            dataIndex: 'categories',
            render: (categories: ICategory2[]) => {
                return <ShowMoreContainer>
                    <div className={styles.tag_wrapper}>
                        {categories?.map((item, index) => <Tag key={index} color="#108ee9">{item?.doctor_category_title}</Tag>)}
                    </div>
                </ShowMoreContainer>
            },
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
            render: (specialities: string[]) => {
                return <div className={styles.tag_wrapper}>
                    {specialities?.map((item, index) => <Tag key={index} color="#108ee9">{item}</Tag>)}
                </div>
            },
        },
        {
            title: 'Процедуры',
            key: 'procedures',
            dataIndex: 'procedures',
            render: (procedures: string[]) => {
                return <ShowMoreContainer>
                    <div className={styles.tag_wrapper}>
                        {procedures?.map((item, index) => <Tag key={index} color="#108ee9">{item}</Tag>)}
                    </div>
                </ShowMoreContainer>
            },
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
            render: (branches: string[]) => <ShowMoreContainer>
                {branches.join(', ')}
            </ShowMoreContainer>
        },
        {
            title: 'Редактировать',
            render: (data: IAllDoctors) => <Button
                onClick={() => handleGoEditPage(data)}
                type={"primary"}
            >
                Редактировать
            </Button>
        },
        // {
        //     title: 'Специальности',
        //     key: 'action',
        //     render: (item: IAllDoctors) => (
        //         <Button
        //             onClick={() => handleSpecsOpen(item)}
        //         >
        //             Специальности
        //         </Button>
        //     ),
        // },
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
            render: (photo: string) => <img src={photo} alt="фото" style={{width: '100px'}}/>,
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
                title={'Создание врача'}
                onClose={onClose}
                open={createUpdateModalOpen}
                width="90%"
            >
                <DoctorCreateForm
                    formType={'create'}
                    initialFields={createUpdateFormInitialFields}
                    // @ts-ignore
                    onSubmit={onSubmitCreateUpdateModal}
                    onClose={onClose}
                    isLoading={isCreateLoading}
                />
            </Drawer>
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
                width="80%"
            >
                <div className={styles.action}>
                    <Button
                        onClick={() => onOpenPhotoModal(selectedDoctorId as number, null,  'create')}
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
            <div className={styles.container}>
                <div className={styles.action}>
                    <Button
                        // onClick={onOpenCreateUpdateModal}
                        onClick={() => navigate( 'create')}
                        type={'primary'}
                        size={"large"}
                    >
                        Создать
                    </Button>
                </div>
                <AllDoctorsFilter
                    branchesOptions={clinicOptions}
                    specialitiesOptions={specOptions}
                    citiesOptions={cityOptions}
                    categoriesOptions={categoryOptions}
                    branchesLoading={clinicsLoading}
                    categoriesLoading={categoryLoading}
                    citiesLoading={citiesLoading}
                    specLoading={allSpecLoading}
                    onFilter={handleFilter}
                />
                <CustomTable
                    columns={columns}
                    dataSource={data?.results}
                    loading={isLoading}
                    setPage={setPage}
                    total={data?.count ?? 0}
                    current={page}
                />
            </div>
        </>
    );
};

export default DoctorsPage2;
