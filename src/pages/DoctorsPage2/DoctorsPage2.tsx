import {CustomTable} from "../../components/Shared/CustomTable";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {useState} from "react";
import {FormInitialFieldsParamsType, IGet} from "../../types/common.ts";
import {Button, Drawer, Tag} from "antd";
import {useNavigate} from "react-router-dom";
import {DoctorCreateForm} from "../../components/Doctors/DoctorCreateForm/DoctorCreateForm.tsx";
import {customNotification} from "../../utils/customNotification.ts";
import styles from './styles.module.scss';
import {formatDateToString} from "../../utils/date/getDates.ts";
import {IFranchise} from "../../types/franchiseTypes.ts";
import {IAllDoctors, ICategory2, ICreateDoctors} from "../../types/allDoctors.ts";
import {IAllSpec} from "../../types/doctorSpec.ts";
import {selectOptionsParser} from "../../utils/selectOptionsParser.ts";
import ShowMoreContainer from "../../components/Shared/ShowMoreContainer/ShowMoreContainer.tsx";
import {objectToQueryParams} from "../../utils/objectToQueryParams.ts";
import AllDoctorsFilter from "../../components/AllDoctors/AllDoctorsFilter/AllDoctorsFilter.tsx";

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

const DoctorsPage2 = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [createUpdateModalOpen, setCreateUpdateModalOpen] = useState<boolean>(false);
    const [createUpdateFormInitialFields, setCreateUpdateFormInitialFields] = useState<FormInitialFieldsParamsType[]>(initialValues);
    const [params, setParams] = useState<string>('');

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

    const {data, isLoading} = useQuery({
        queryKey: ['doctorsData', page, params],
        queryFn: () =>
            axiosInstance
                .get<IGet<IAllDoctors>>(`partners/franchise-info/all-doctors/?page=${page}${params}`)
                .then((response) => response?.data),
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

    const onClose = () => {
        setCreateUpdateModalOpen(false);
        setCreateUpdateFormInitialFields(initialValues);
    };

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
