import {useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {CustomTable} from "../../components/Shared/CustomTable";
import {useStateContext} from "../../contexts";
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

const AllDoctorsPage = () => {
    const queryClient = useQueryClient();
    const { state } = useStateContext();
    const { addressId } = state;
    const [page, setPage] = useState(1);
    const [createUpdateModalOpen, setCreateUpdateModalOpen] = useState<boolean>(false);
    const [editEntity, setEditEntity] = useState<IAllDoctors | null>(null);
    const [createUpdateFormInitialFields, setCreateUpdateFormInitialFields] = useState<FormInitialFieldsParamsType[]>(initialValues);
    const [formType, setFormType] = useState<ActionType>('');
    const [activeDoctor, setActiveDoctor] = useState<IAllDoctors | null>(null);
    const [isOpenSpecs, setIsOpenSpecs] = useState(false);


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

    const { data, isLoading } = useQuery({
        queryKey: ['doctorsData', page],
        queryFn: () =>
            axiosInstance
                .get<IGet<IAllDoctors>>(`partners/franchise-info/all-doctors/`)
                .then((response) => response?.data),
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

    const columns = [
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
            title: 'Фото',
            key: 'latest_photo',
            dataIndex: 'latest_photo',
            render: (photo: string) => <img src={photo} alt="doctor" style={{ width: 50, height: 50 }} />,
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
            title: 'Открыть специальности',
            key: 'action',
            render: (item: IAllDoctors) => (
                <Button
                    onClick={() => handleSpecsOpen(item)}
                >
                    Открыть специальности
                </Button>
            ),
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
