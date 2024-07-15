import {CustomTable} from "../../components/Shared/CustomTable";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {useStateContext} from "../../contexts";
import {IDoctor, IDoctorCreate, SpecialitiesAndProcedure} from "../../types/doctor.ts";
import {useState} from "react";
import {DoctorProfile} from "../../components/Doctors/DoctorProfile/DoctorProfile.tsx";
import {FormInitialFieldsParamsType, IGet} from "../../types/common.ts";
import {Button, Drawer} from "antd";
import {useNavigate} from "react-router-dom";
import {objectToQueryParams} from "../../utils/objectToQueryParams.ts";
import {DoctorCreateForm} from "../../components/Doctors/DoctorCreateForm/DoctorCreateForm.tsx";
import {customNotification} from "../../utils/customNotification.ts";
import styles from './styles.module.scss'
import {formatDateToString} from "../../utils/date/getDates.ts";

const initialValues: FormInitialFieldsParamsType[] = [
    {
        name: 'first_name',
        value: '1',
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
        name: 'category',
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
        name: 'photos',
        value: [],
    },
];


const DoctorsPage = () => {

    const queryClient = useQueryClient();

    const {state} = useStateContext()

    const navigate = useNavigate()

    const {addressId, doctor} = state

    const {query} = doctor

    const [page, setPage] = useState(1)
    const [createUpdateModalOpen, setCreateUpdateModalOpen] = useState<boolean>(false)

    const {
        mutate: onCreate,
        isPending: isCreateLoading,
    } = useMutation({
        mutationKey: ['createDoctor'],
        mutationFn: (body: IDoctorCreate) => {
            return axiosInstance.post(`partners/franchise-branches/${addressId}/doctors/`, body)
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Врач успешно создан!'
            })
            queryClient.invalidateQueries({queryKey: ['doctorsData']});
        },
    });

    const {
        mutate: onDeleteDoctor,
        isPending: isDeleteLoading,
    } = useMutation({
        mutationKey: ['deleteDoctor'],
        mutationFn: (id: number) =>
            axiosInstance.delete(`partners/franchise-branches/${addressId}/doctors/${id}/`),
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Врач успешно удален!'
            })
            queryClient.invalidateQueries({queryKey: ['doctorsData']});
        }
    });

    const {data, isFetching: isLoading} = useQuery({
        queryKey: ['doctorsData', addressId, page, query],
        queryFn: () =>
            axiosInstance
                .get<IGet<IDoctor>>(`partners/franchise-branches/${addressId}/doctors/?page=${page}&${objectToQueryParams({
                    part_of_name: query
                })}`)
                .then((response) => response?.data),
        enabled: !!addressId
    });

    const handleGoEditPage = (doctorDetails: IDoctor) => {
        navigate(`/doctor/${doctorDetails?.id}`)
    }

    const handleDeleteDoctor = (id: number) => {
        onDeleteDoctor(id)
    }

    const columns = [
        {
            title: '',
            dataIndex: 'count',
            key: 'count',
        },
        {
            title: 'Врач',
            dataIndex: 'full_name',
            key: 'full_name',
            render: (name: string) => <DoctorProfile
                title={name}
                imgSrc={''}
            />
        },
        {
            title: 'Специальности/Процедуры',
            key: 'specialities_and_procedures',
            dataIndex: 'specialities_and_procedures',
            render: (data: SpecialitiesAndProcedure[], _: any) => (
                <div style={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <div>
                        {data?.map((item, index) => {
                            return `${item?.speciality?.medical_speciality_title}${index === data?.length - 1 ? '' : ','} `
                        })}
                    </div>
                </div>

            ),
        },
        {
            title: 'Опубликован',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (is_active: boolean) => <p>{is_active ? 'Да' : 'Нет'}</p>
        },
        {
            title: 'Редактировать',
            render: (data: IDoctor) => <Button
                onClick={() => handleGoEditPage(data)}
                type={"primary"}
            >
                Редактировать
            </Button>
        },
        {
            title: 'Удалить',
            render: (data: IDoctor) => <Button
                onClick={() => handleDeleteDoctor(data?.id as number)}
                disabled={isDeleteLoading}
            >
                Удалить
            </Button>
        },
    ];

    const onClose = () => {
        setCreateUpdateModalOpen(false);
    };

    const onOpenCreateUpdateModal = () => {
        setCreateUpdateModalOpen(true);
    };

    const onSubmitCreateUpdateModal = async (formData: IDoctorCreate) => {

        const payload = {
            ...formData,
            works_since: formatDateToString(formData?.works_since?.$d) ?? '',
            photos: formData?.photos.map(photo => ({
                franchise: 0,
                // @ts-ignore
                photo: photo?.thumbUrl,
                title_code: 'string',
            }))
        };

        // @ts-ignore
        onCreate(payload);
        onClose();
    };

    return (
        <>
            <Drawer
                title={'Создание врача'}
                onClose={onClose}
                open={createUpdateModalOpen}
                width="500px"
            >
                <DoctorCreateForm
                    formType={'create'}
                    initialFields={initialValues}
                    onSubmit={onSubmitCreateUpdateModal}
                    onClose={onClose}
                    isLoading={isCreateLoading}
                />
            </Drawer>
            <div className={styles.container}>
                <div className={styles.action}>
                    <Button
                        onClick={onOpenCreateUpdateModal}
                        type={'primary'}
                        size={"large"}
                    >
                        Создать
                    </Button>
                </div>
                {/*<Filters/>*/}
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

export default DoctorsPage;
