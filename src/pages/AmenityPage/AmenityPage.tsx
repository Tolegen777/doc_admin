import styles from './styles.module.scss';
import { CustomTable } from "../../components/Shared/CustomTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../api";
import { useStateContext } from "../../contexts";
import { ActionType, FormInitialFieldsParamsType } from "../../types/common.ts";
import { useState } from "react";
import { customNotification } from "../../utils/customNotification.ts";
import { Button, Drawer } from "antd";
import { changeFormFieldsData } from "../../utils/changeFormFieldsData.ts";
import { IAmenityCreateUpdate, IAmenityResponce } from "../../types/amenityTypes.ts";
import { AmenityCreateUpdateForm } from "../../components/Amenity/AmenityCreateUpdateForm/AmenityCreateUpdateForm.tsx";

const initialValues: FormInitialFieldsParamsType[] = [
    {
        name: 'clinic_branch',
        value: null,
    },
    {
        name: 'amenity',
        value: null,
    },
];

const AmenitiesPage = () => {
    const queryClient = useQueryClient();
    const { state } = useStateContext();
    const { addressId } = state;
    const [page, setPage] = useState(1);
    const [createUpdateModalOpen, setCreateUpdateModalOpen] = useState<boolean>(false);
    const [editEntity, setEditEntity] = useState<IAmenityResponce | null>(null);
    const [createUpdateFormInitialFields, setCreateUpdateFormInitialFields] = useState<FormInitialFieldsParamsType[]>(initialValues);
    const [formType, setFormType] = useState<ActionType>('');

    const {
        mutate: onUpdate,
        isPending: isUpdateLoading,
    } = useMutation({
        mutationKey: ['updateAmenity'],
        mutationFn: ({ id, ...body }: IAmenityCreateUpdate) => {
            return axiosInstance.put(`partners/franchise-branches/${addressId}/amenities/${id}/`, body);
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Удобство успешно изменено!'
            });
            queryClient.invalidateQueries({ queryKey: ['amenitiesData'] });
        },
    });

    const {
        mutate: onCreate,
        isPending: isCreateLoading,
    } = useMutation({
        mutationKey: ['createAmenity'],
        mutationFn: (body: IAmenityCreateUpdate) => {
            return axiosInstance.post(`partners/franchise-branches/${addressId}/amenities/`, body);
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Удобство успешно создано!'
            });
            queryClient.invalidateQueries({ queryKey: ['amenitiesData'] });
        },
    });

    const {
        mutate: onDelete,
        isPending: isDeleteLoading,
    } = useMutation({
        mutationKey: ['deleteAmenity'],
        mutationFn: (id: number) =>
            axiosInstance.delete(`partners/franchise-branches/${addressId}/amenities/${id}/`),
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Удобство успешно удалено!'
            });
            queryClient.invalidateQueries({ queryKey: ['amenitiesData'] });
        }
    });

    const { data, isLoading } = useQuery({
        queryKey: ['amenitiesData', addressId, page],
        queryFn: () =>
            axiosInstance
                .get<IAmenityResponce[]>(`partners/franchise-branches/${addressId}/amenities/?page=${page}`)
                .then((response) => response?.data),
        enabled: !!addressId
    });

    const onClose = () => {
        setCreateUpdateModalOpen(false);
        setCreateUpdateFormInitialFields(initialValues);
        setEditEntity(null);
        setFormType('');
    };

    const onOpenCreateUpdateModal = (data: IAmenityResponce | null, type: ActionType) => {
        if (data && type === 'update') {
            setEditEntity(data);
            setCreateUpdateFormInitialFields(changeFormFieldsData<object>(initialValues, data));
        }

        setFormType(type);
        setCreateUpdateModalOpen(true);
    };

    const onSubmitCreateUpdateModal = async (formData: IAmenityCreateUpdate) => {
        if (formType === 'update') {
            const payload = {
                ...formData,
                id: editEntity?.id as number
            };

            onUpdate(payload);
        } else {
            onCreate(formData);
        }

        onClose();
    };

    const handleDelete = (id: number) => {
        onDelete(id);
    };

    const columns = [
        {
            title: 'Идентификатор',
            key: 'id',
            dataIndex: 'id',
        },
        {
            title: 'ID филиала клиники',
            key: 'clinic_branch',
            dataIndex: 'clinic_branch',
        },
        {
            title: 'ID удобства',
            key: 'amenity',
            dataIndex: 'amenity',
        },
        {
            title: 'Редактировать',
            render: (data: IAmenityResponce) => <Button
                onClick={() => onOpenCreateUpdateModal(data, 'update')}
                type={"primary"}
            >
                Редактировать
            </Button>
        },
        {
            title: 'Удалить',
            render: (data: IAmenityResponce) => <Button
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
                title={formType === 'create' ? 'Создание удобства' : 'Редактирование удобства'}
                onClose={onClose}
                open={createUpdateModalOpen}
                width="500px"
            >
                <AmenityCreateUpdateForm
                    formType={formType}
                    initialFields={createUpdateFormInitialFields}
                    onSubmit={onSubmitCreateUpdateModal}
                    onClose={onClose}
                    isLoading={isUpdateLoading || isCreateLoading}
                />
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

export default AmenitiesPage;
