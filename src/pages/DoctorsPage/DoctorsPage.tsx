import styles from './styles.module.scss'
import {CustomTable} from "../../components/Shared/CustomTable";
// import {Button} from "antd";
import {useQuery} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {useStateContext} from "../../contexts";
import {IDoctor, SpecialitiesAndProcedure} from "../../types/doctor.ts";
import {useState} from "react";
import {DoctorProfile} from "../../components/Doctors/DoctorProfile/DoctorProfile.tsx";
import {IGet} from "../../types/common.ts";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";
import {objectToQueryParams} from "../../utils/objectToQueryParams.ts";

const hiddenStyles = {
    // whiteSpace: 'nowrap',
    // width: 400,
    // overflow: 'hidden',
    // textOverflow: 'ellipsis',
}
const DoctorsPage = () => {

    const {state} = useStateContext()

    const navigate = useNavigate()

    const {addressId, doctor} = state

    const {query} = doctor

    const [page, setPage] = useState(1)

    const [fullVisibleFullItems] = useState<number[]>([])

    const getIsShowFull = (number: number) => {
        return fullVisibleFullItems.includes(number);

    }

    const handleGoEditPage = (doctorDetails: IDoctor) => {
        navigate(`/doctor/${doctorDetails?.id}`)
    }

    // const handleSetFullVisibleFullItems = (index: number) => {
    //     const isIndexVisible = fullVisibleFullItems?.includes(index)
    //
    //     let payload = []
    //
    //     if (isIndexVisible) {
    //         payload =  fullVisibleFullItems.filter(item => item !== index)
    //     } else {
    //         payload = [...fullVisibleFullItems, index]
    //     }
    //
    //     setFullVisibleFullItems(payload)
    // }

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
            render: (data: SpecialitiesAndProcedure[], _: any, index: number) => (
                <div style={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <div style={getIsShowFull(index) ? {} : hiddenStyles}>
                        {data?.map((item, index) => {
                            return `${item?.speciality?.medical_speciality_title}${index === data?.length - 1 ? '' : ','} `
                        })}
                    </div>
                    {/*<Button*/}
                    {/*    type={'text'}*/}
                    {/*    style={{color: '#5194C1', padding: 2}}*/}
                    {/*    onClick={() => handleSetFullVisibleFullItems(index)}*/}
                    {/*>*/}
                    {/*    {getIsShowFull(index) ? 'скрыть' : 'еще'}*/}
                    {/*</Button>*/}
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
    ];

    const { data, isLoading } = useQuery({
        queryKey: ['doctorsData', addressId, page, query],
        queryFn: () =>
            axiosInstance
                .get<IGet<IDoctor>>(`partners/franchise-branches/${addressId}/doctors/?page=${page}&${objectToQueryParams({
                    part_of_name: query
                })}`)
                .then((response) => response?.data),
        enabled: !!addressId
    });

    return (
        <div className={styles.container}>
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
    );
};

export default DoctorsPage;
