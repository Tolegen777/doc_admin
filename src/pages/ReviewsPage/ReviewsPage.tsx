import styles from './styles.module.scss'
import {CustomTable} from "../../components/Shared/CustomTable";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {useStateContext} from "../../contexts";
import {formatDateTime} from "../../utils/date/getDates.ts";
import {DoctorProfile} from "../../components/Doctors/DoctorProfile/DoctorProfile.tsx";
import {FormInitialFieldsParamsType, IGet} from "../../types/common.ts";
import {useState} from "react";
import {IReview, IReviewPayload} from "../../types/reviewTypes.ts";
import {customNotification} from "../../utils/customNotification.ts";
import {changeFormFieldsData} from "../../utils/changeFormFieldsData.ts";
import {Button, Drawer} from "antd";
import {IDoctor} from "../../types/doctor.ts";
import {ReviewUpdateForm} from "../../components/Review/ReviewUpdateForm/ReviewUpdateForm.tsx";

const initialValues: FormInitialFieldsParamsType[] = [
    {
        name: 'text',
        value: 'string',
    },
    {
        name: 'rating',
        value: 1,
    },
    {
        name: 'is_reply',
        value: true,
    },
    {
        name: 'parent_comment',
        value: 0,
    },
    {
        name: 'visit',
        value: 0,
    },
];


const ReviewsPage = () => {

    const queryClient = useQueryClient();

    const {state} = useStateContext()

    const {addressId} = state

    const [page, setPage] = useState(1)
    const [createUpdateModalOpen, setCreateUpdateModalOpen] = useState<boolean>(false)
    const [editEntity, setEditEntity] = useState<IReview | null>(null)
    const [createUpdateFormInitialFields, setCreateUpdateFormInitialFields] = useState<FormInitialFieldsParamsType[]>(initialValues)

    const {
        mutate: onUpdate,
        isPending: isUpdateLoading,
    } = useMutation({
        mutationKey: ['updateReview'],
        mutationFn: ({id, ...body}: IReviewPayload) => {
            return axiosInstance.put(`partners/franchise-branches/${addressId}/reviews/manage/${id}/`, body)
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Отзыв успешно изменен!'
            })
            queryClient.invalidateQueries({queryKey: ['reviewsData']});
        },
    });

    const {
        mutate: onDelete,
        isPending: isDeleteLoading,
    } = useMutation({
        mutationKey: ['deleteReview'],
        mutationFn: (id: number) =>
            axiosInstance.delete(`partners/franchise-branches/${addressId}/reviews/manage/${id}/`),
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Отзыв успешно удален!'
            })
            queryClient.invalidateQueries({queryKey: ['reviewsData']});
        }
    });

    const {data, isLoading} = useQuery({
        queryKey: ['reviewsData', addressId, page],
        queryFn: () =>
            axiosInstance
                .get<IGet<IReview>>(`partners/franchise-branches/${addressId}/reviews/?page=${page}`)
                .then((response) => response?.data),
        enabled: !!addressId
    });

    const onClose = () => {
        setCreateUpdateModalOpen(false);
        setCreateUpdateFormInitialFields(initialValues)
        setEditEntity(null)
    };

    const onOpenCreateUpdateModal = (data: IReview) => {
        if (data) {
            setEditEntity(data)
            setCreateUpdateFormInitialFields(changeFormFieldsData<object>(initialValues,
                data
            ))
        }

        setCreateUpdateModalOpen(true);
    };

    const onSubmitCreateUpdateModal = async (formData: IReviewPayload) => {

        const payload = {
            ...formData,
            id: editEntity?.id
        };

        onUpdate(payload);
        onClose();
    };

    const handleDelete = (id: number) => {
        onDelete(id)
    }

    const columns = [
        {
            title: 'Дата визита',
            key: 'visit_date',
            render: (review: IReview) => (
                <p>{formatDateTime({ isoDateTime: review?.visit_date })}</p>
            ),
        },
        {
            title: 'Врач',
            key: 'doctor_name',
            render: (review: IReview) => (
                <DoctorProfile
                    title={review?.doctor_name}
                    subTitle={review?.procedure_title}
                    imgSrc={''}
                />
            ),
        },
        {
            title: 'Процедура',
            key: 'procedure_title',
            render: (review: IReview) => (
                <div>{review?.procedure_title}</div>
            ),
        },
        {
            title: 'Пациент',
            key: 'patient_name',
            render: (review: IReview) => (
                <div>
                    <div>{review?.patient_name}</div>
                </div>
            ),
        },
        {
            title: 'Текст отзыва',
            key: 'text',
            render: (review: IReview) => (
                <div>{review?.text}</div>
            ),
        },
        {
            title: 'Рейтинг',
            key: 'rating',
            render: (review: IReview) => (
                <div>{review?.rating}</div>
            ),
        },
        {
            title: 'Дата создания/обновления',
            key: 'created_at',
            render: (review: IReview) => (
                <div>
                    <p>{formatDateTime({ isoDateTime: review?.created_at })}</p>
                    {review?.updated_at?.length > 0 && (
                        <p>
                            Изменено: {formatDateTime({ isoDateTime: review?.updated_at })}
                        </p>
                    )}
                </div>
            ),
        },
        {
            title: 'Редактировать',
            render: (data: IReview) => <Button
                onClick={() => onOpenCreateUpdateModal(data)}
                type={"primary"}
            >
                Редактировать
            </Button>
        },
        {
            title: 'Удалить',
            render: (data: IDoctor) => <Button
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
                title={'Редактирование записи'}
                onClose={onClose}
                open={createUpdateModalOpen}
                width="500px"
            >
                <ReviewUpdateForm
                    formType={'update'}
                    initialFields={createUpdateFormInitialFields}
                    onSubmit={onSubmitCreateUpdateModal}
                    onClose={onClose}
                    isLoading={isUpdateLoading}
                />
            </Drawer>
            <div className={styles.container}>
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

export default ReviewsPage;
