import styles from './styles.module.scss'
import {CustomTable} from "../../components/Shared/CustomTable";
import {useQuery} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {useStateContext} from "../../contexts";
import {formatDateTime} from "../../utils/date/getDates.ts";
import {DoctorProfile} from "../../components/Doctors/DoctorProfile/DoctorProfile.tsx";
import {IGet} from "../../types/common.ts";
import {useState} from "react";
import {IReview} from "../../types/reviewTypes.ts";

const ReviewsPage = () => {

    const {state} = useStateContext()

    const {addressId} = state

    const [page, setPage] = useState(1)

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
    ];

    const {data, isLoading} = useQuery({
        queryKey: ['reviewsData', addressId, page],
        queryFn: () =>
            axiosInstance
                .get<IGet<IReview>>(`partners/franchise-branches/${addressId}/reviews/?page=${page}`)
                .then((response) => response?.data),
        enabled: !!addressId
    });

    return (
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
    );
};

export default ReviewsPage;
