import styles from './styles.module.scss';
import {CustomTable} from "../../components/Shared/CustomTable";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {ActionType, FormInitialFieldsParamsType} from "../../types/common.ts";
import {useState} from "react";
import {customNotification} from "../../utils/customNotification.ts";
import {Button, Drawer} from "antd";
import {changeFormFieldsData} from "../../utils/changeFormFieldsData.ts";
import {
    IDescriptionFragment,
    IDescriptionFragmentCreate,
    IDescriptionFragmentUpdate
} from "../../types/descriptionFragment.ts";
import {
    DescriptionFragmentCreateUpdateForm
} from "../../components/DescriptionFragmentPage/DescriptionFragmentCreateUpdateForm/DescriptionFragmentCreateUpdateForm.tsx";
import {useParams} from "react-router-dom";
import ShowMoreContainer from "../../components/Shared/ShowMoreContainer/ShowMoreContainer.tsx";

const initialValues: FormInitialFieldsParamsType[] = [
    {
        name: 'doctor',
        value: null,
    },
    {
        name: 'title',
        value: '',
    },
    {
        name: 'content',
        value: '',
    },
    {
        name: 'number',
        value: null,
    },
];

const DescriptionFragmentPage = () => {
    const queryClient = useQueryClient();
    const pathname = useParams()
    const [page, setPage] = useState(1);
    const [createUpdateModalOpen, setCreateUpdateModalOpen] = useState<boolean>(false);
    const [editEntity, setEditEntity] = useState<IDescriptionFragment | null>(null);
    const [createUpdateFormInitialFields, setCreateUpdateFormInitialFields] = useState<FormInitialFieldsParamsType[]>(initialValues);
    const [formType, setFormType] = useState<ActionType>('');

    const {
        mutate: onUpdate,
        isPending: isUpdateLoading,
    } = useMutation({
        mutationKey: ['updateDescriptionFragment'],
        mutationFn: ({id, ...body}: IDescriptionFragmentUpdate) => {
            return axiosInstance.put(`partners/franchise-info/all-doctors/${pathname?.id}/description-fragments/${id}/`, body);
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Фрагмент описания успешно изменен!'
            });
            queryClient.invalidateQueries({queryKey: ['descriptionFragmentsData']});
        },
    });

    const {
        mutate: onCreate,
        isPending: isCreateLoading,
    } = useMutation({
        mutationKey: ['createDescriptionFragment'],
        mutationFn: (body: IDescriptionFragmentCreate) => {
            return axiosInstance.post(`partners/franchise-info/all-doctors/${pathname?.id}/description-fragments/`, body);
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Фрагмент описания успешно создан!'
            });
            queryClient.invalidateQueries({queryKey: ['descriptionFragmentsData']});
        },
    });

    const {
        mutate: onDelete,
        isPending: isDeleteLoading,
    } = useMutation({
        mutationKey: ['deleteDescriptionFragment'],
        mutationFn: (id: number) =>
            axiosInstance.delete(`partners/franchise-info/all-doctors/${pathname?.id}/description-fragments/${id}/`),
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Фрагмент описания успешно удален!'
            });
            queryClient.invalidateQueries({queryKey: ['descriptionFragmentsData']});
        }
    });

    const {data, isLoading} = useQuery({
        queryKey: ['descriptionFragmentsData', page],
        queryFn: () =>
            axiosInstance
                .get<IDescriptionFragment[]>(`partners/franchise-info/all-doctors/${pathname?.id}/description-fragments/?page=${page}`)
                .then((response) => response?.data)
    });

    const onClose = () => {
        setCreateUpdateModalOpen(false);
        setCreateUpdateFormInitialFields(initialValues);
        setEditEntity(null);
        setFormType('');
    };

    const onOpenCreateUpdateModal = (data: IDescriptionFragment | null, type: ActionType) => {
        if (data && type === 'update') {
            setEditEntity(data);
            setCreateUpdateFormInitialFields(changeFormFieldsData<object>(initialValues, data));
        } else {
            setCreateUpdateFormInitialFields(initialValues)
        }

        setFormType(type);
        setCreateUpdateModalOpen(true);
    };

    const onSubmitCreateUpdateModal = async (formData: IDescriptionFragmentCreate) => {
        if (formType === 'update') {
            const payload = {
                ...formData,
                id: editEntity?.id as number,
                doctor: parseInt(pathname?.id ?? '')
            };

            onUpdate(payload);
        } else {
            onCreate({
                ...formData,
                doctor: parseInt(pathname?.id ?? '')
            });
        }

        onClose();
    };

    const handleDelete = (id: number) => {
        onDelete(id);
    };

    const columns = [
        {
            title: 'ID',
            key: 'id',
            dataIndex: 'id',
        },
        {
            title: 'Идентификатор врача',
            key: 'doctor',
            dataIndex: 'doctor',
        },
        {
            title: 'Заголовок',
            key: 'title',
            dataIndex: 'title',
        },
        {
            title: 'Контент',
            key: 'content',
            dataIndex: 'content',
            render: (item: string) => <ShowMoreContainer>
                <div dangerouslySetInnerHTML={{__html: item}}/>
            </ShowMoreContainer>
        },
        {
            title: 'Номер',
            key: 'number',
            dataIndex: 'number',
        },
        {
            title: 'Редактировать',
            render: (data: IDescriptionFragment) => <Button
                onClick={() => onOpenCreateUpdateModal(data, 'update')}
                type={"primary"}
            >
                Редактировать
            </Button>
        },
        {
            title: 'Удалить',
            render: (data: IDescriptionFragment) => <Button
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
                title={formType === 'create' ? 'Создание фрагмента описания' : 'Редактирование фрагмента описания'}
                onClose={onClose}
                open={createUpdateModalOpen}
                width="80%"
            >
                <DescriptionFragmentCreateUpdateForm
                    formType={formType}
                    initialFields={createUpdateFormInitialFields}
                    onSubmit={onSubmitCreateUpdateModal}
                    onClose={onClose}
                    isLoading={isUpdateLoading || isCreateLoading}
                />
            </Drawer>
            <div className={styles.container}>
                <div className={styles.title_wrap}>
                    <div className={styles.title}>
                        Данные описания врача
                    </div>
                    <div className={styles.action}>
                        <Button
                            onClick={() => onOpenCreateUpdateModal(null, 'create')}
                            type={'primary'}
                            size={"large"}
                        >
                            Создать
                        </Button>
                    </div>
                </div>
                <CustomTable
                    columns={columns}
                    dataSource={data}
                    loading={isLoading}
                    setPage={setPage}
                    pagination={false}
                    current={1}
                    total={data?.length ?? 0}
                />
            </div>
        </>
    );
};

export default DescriptionFragmentPage;
