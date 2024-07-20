import styles from './styles.module.scss';
import {CustomTable} from "../../components/Shared/CustomTable";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {useStateContext} from "../../contexts";
import {ActionType, FormInitialFieldsParamsType, IGet} from "../../types/common.ts";
import {useState} from "react";
import {customNotification} from "../../utils/customNotification.ts";
import {Button, Drawer} from "antd";
import {changeFormFieldsData} from "../../utils/changeFormFieldsData.ts";
import {IFranchiseCreateUpdate, IFranchisePhoto, IFranchiseResponce} from "../../types/franchiseTypes.ts";
import {
    FranchiseCreateUpdateForm
} from "../../components/Franchise/FranchiseCreateUpdateForm/FranchiseCreateUpdateForm.tsx";
import {PhotoForm} from "../../components/Franchise/PhotoForm/PhotoForm.tsx";
import {CityTypes} from "../../types/cityTypes.ts";

const initialValues: FormInitialFieldsParamsType[] = [
    {
        name: 'title',
        value: '',
    },
    {
        name: 'description',
        value: '',
    },
    {
        name: 'address',
        value: '',
    },
    {
        name: 'latitude',
        value: 0,
    },
    {
        name: 'longitude',
        value: 0,
    },
    {
        name: 'city',
        value: null,
    },
];

const photoInitialValues: FormInitialFieldsParamsType[] = [
    {
        name: 'branch',
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

const formatCoordinates = (latitude: number, longitude: number) => {
    return `Lat: ${latitude}, Lng: ${longitude}`;
}

const FranchisePage = () => {
    const queryClient = useQueryClient();
    const { state } = useStateContext();
    const { addressId } = state;
    const [page, setPage] = useState(1);
    const [createUpdateModalOpen, setCreateUpdateModalOpen] = useState<boolean>(false);
    const [editEntity, setEditEntity] = useState<IFranchiseResponce | null>(null);
    const [createUpdateFormInitialFields, setCreateUpdateFormInitialFields] = useState<FormInitialFieldsParamsType[]>(initialValues);
    const [formType, setFormType] = useState<ActionType>('');
    const [photoModalOpen, setPhotoModalOpen] = useState<boolean>(false);
    const [photoFormInitialFields, setPhotoFormInitialFields] = useState<FormInitialFieldsParamsType[]>(photoInitialValues);
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
    const [photosDrawerOpen, setPhotosDrawerOpen] = useState<boolean>(false);
    const [photoFormType, setPhotoFormType] = useState<ActionType>('');
    const [photoEditEntity, setPhotoEditEntity] = useState<IFranchisePhoto | null>(null);

    const {
        mutate: onUpdate,
        isPending: isUpdateLoading,
    } = useMutation({
        mutationKey: ['updateFranchise'],
        mutationFn: ({ id, ...body }: IFranchiseCreateUpdate) => {
            return axiosInstance.put(`partners/franchise-branches/${id}`, body);
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Франшиза успешно изменена!'
            });
            queryClient.invalidateQueries({ queryKey: ['franchiseData'] });
        },
    });

    const {
        mutate: onCreate,
        isPending: isCreateLoading,
    } = useMutation({
        mutationKey: ['createFranchise'],
        mutationFn: (body: IFranchiseCreateUpdate) => {
            return axiosInstance.post(`partners/franchise-branches/`, body);
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Франшиза успешно создана!'
            });
            queryClient.invalidateQueries({ queryKey: ['franchiseData'] });
        },
    });

    const {
        mutate: onDelete,
        isPending: isDeleteLoading,
    } = useMutation({
        mutationKey: ['deleteFranchise'],
        mutationFn: (id: number) =>
            axiosInstance.delete(`partners/franchise-branches/${id}/`),
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Франшиза успешно удалена!'
            });
            queryClient.invalidateQueries({ queryKey: ['franchiseData'] });
            setPage(1)
        }
    });

    const {
        mutate: onPhotoCreateUpdate,
        isPending: isPhotoCreateUpdateLoading,
    } = useMutation({
        mutationKey: ['createUpdatePhoto'],
        mutationFn: (body: any) => {
            const url = body.id ?
                `partners/franchise-branches/${body.branch}/photos/${body.id}/` :
                `partners/franchise-branches/${body.branch}/photos/`;
            return axiosInstance({
                method: body.id ? 'put' : 'post',
                url,
                data: body,
            });
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: `Фото успешно ${photoFormInitialFields.some(field => field.name === 'id' && field.value) ? 'изменено' : 'создано'}!`
            });
            queryClient.invalidateQueries({ queryKey: ['franchisePhotos', selectedBranchId] });
        },
    });

    const {
        mutate: onPhotoDelete,
        isPending: isPhotoDeleteLoading,
    } = useMutation({
        mutationKey: ['deletePhoto'],
        mutationFn: ({ branchId, photoId }: { branchId: number, photoId: number }) =>
            axiosInstance.delete(`partners/franchise-branches/${branchId}/photos/${photoId}/`),
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Фото успешно удалено!'
            });
            queryClient.invalidateQueries({ queryKey: ['franchisePhotos', selectedBranchId] });
        }
    });

    const { data, isLoading } = useQuery({
        queryKey: ['franchiseData', addressId, page],
        queryFn: () =>
            axiosInstance
                .get<IGet<IFranchiseResponce>>(`partners/franchise-branches?page=${page}`)
                .then((response) => response?.data),
        enabled: !!addressId
    });

    const { data: cities, isLoading: cityLoading } = useQuery({
        queryKey: ['cityData'],
        queryFn: () =>
            axiosInstance
                .get<CityTypes[]>(`patients/cities`)
                .then((response) => response?.data),
        refetchOnMount: false
    });

    const { data: photos, isFetching: isPhotosLoading } = useQuery({
        queryKey: ['franchisePhotos', selectedBranchId],
        queryFn: () =>
            axiosInstance
                .get<IFranchisePhoto[]>(`partners/franchise-branches/${selectedBranchId}/photos/`)
                .then((response) => response?.data),
        enabled: !!selectedBranchId && photosDrawerOpen,
    });

    const onClose = () => {
        setCreateUpdateModalOpen(false);
        setCreateUpdateFormInitialFields(initialValues);
        setEditEntity(null);
        setFormType('');
    };

    const onClosePhotoModal = () => {
        setPhotoModalOpen(false);
        setPhotoFormInitialFields(photoInitialValues);
    };

    const onOpenCreateUpdateModal = (data: IFranchiseResponce | null, type: ActionType) => {
        if (data && type === 'update') {
            setEditEntity(data);
            setCreateUpdateFormInitialFields(changeFormFieldsData<object>(initialValues, data));
        }

        setFormType(type);
        setCreateUpdateModalOpen(true);
    };

    const onOpenPhotoModal = (branchId: number, photoData: any | null = null, type: ActionType) => {
        setSelectedBranchId(branchId);
        debugger
        if (photoData) {
            setPhotoFormInitialFields(changeFormFieldsData<object>(photoInitialValues, photoData));
            setPhotoEditEntity(photoData);
        } else {
            setPhotoFormInitialFields(photoInitialValues);
        }

        setPhotoModalOpen(true);
        setPhotoFormType(type);
    };

    const onSubmitCreateUpdateModal = async (formData: IFranchiseCreateUpdate) => {
        if (formType === 'update') {
            const payload = {
                ...formData,
                id: editEntity?.id
            };

            onUpdate(payload);
        } else {
            onCreate(formData);
        }

        onClose();
    };

    const onSubmitPhotoModal = async (formData: any) => {
        const payload = {
            branch: selectedBranchId,
            photo: formData?.photo?.find((item: any) => item)?.thumbUrl,
            title_code: formData?.title_code
        };
        onPhotoCreateUpdate(photoFormType === 'create' ? payload : {
            id: photoEditEntity?.id,
            ...payload
        });
        onClosePhotoModal();
    };

    const handleDelete = (id: number) => {
        onDelete(id);
    };

    const handlePhotoDelete = (branchId: number, photoId: number) => {
        onPhotoDelete({ branchId, photoId });
    };

    const openPhotosDrawer = (branchId: number) => {
        setPhotosDrawerOpen(true);
        setSelectedBranchId(branchId);
    };

    const closePhotosDrawer = () => {
        setPhotosDrawerOpen(false);
    };

    const columns = [
        {
            title: 'Идентификатор',
            key: 'id',
            dataIndex: 'id',
        },
        {
            title: 'Название',
            key: 'title',
            dataIndex: 'title',
        },
        {
            title: 'Описание',
            key: 'description',
            dataIndex: 'description',
        },
        {
            title: 'Адрес',
            key: 'address',
            dataIndex: 'address',
        },
        {
            title: 'Координаты',
            key: 'coordinates',
            render: (location: IFranchiseResponce) => <p>{formatCoordinates(location.latitude, location.longitude)}</p>
        },
        {
            title: 'Город',
            key: 'city',
            dataIndex: 'city',
        },
        {
            title: 'Редактировать',
            render: (data: IFranchiseResponce) => <Button
                onClick={() => onOpenCreateUpdateModal(data, 'update')}
                type={"primary"}
            >
                Редактировать
            </Button>
        },
        {
            title: 'Удалить',
            render: (data: IFranchiseResponce) => <Button
                onClick={() => handleDelete(data?.id as number)}
                disabled={isDeleteLoading}
            >
                Удалить
            </Button>
        },
        {
            title: 'Фотографии',
            render: (data: IFranchiseResponce) => (
                <Button onClick={() => openPhotosDrawer(data.id)}>
                    Просмотреть фото
                </Button>
            )
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
                onClick={() => onOpenPhotoModal(selectedBranchId as number, photo, 'update')}
                type={"primary"}
            >
                Редактировать
            </Button>
        },
        {
            title: 'Удалить',
            render: (photo: IFranchisePhoto) => <Button
                onClick={() => handlePhotoDelete(selectedBranchId as number, photo.id)}
                disabled={isPhotoDeleteLoading}
            >
                Удалить
            </Button>
        },
    ];

    return (
        <>
            <Drawer
                title={formType === 'create' ? 'Создание франшизы' : 'Редактирование франшизы'}
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
            <Drawer
                title={photoFormInitialFields.some(field => field.name === 'id' && field.value) ? 'Редактирование фото' : 'Добавление фото'}
                onClose={onClosePhotoModal}
                open={photoModalOpen}
                width="500px"
            >
                <PhotoForm
                    initialFields={photoFormInitialFields}
                    onSubmit={onSubmitPhotoModal}
                    onClose={onClosePhotoModal}
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
                        onClick={() => onOpenPhotoModal(selectedBranchId as number, null, 'create')}
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
                    total={data?.count ?? 0}
                    current={page}
                />
            </div>
        </>
    );
};

export default FranchisePage;
