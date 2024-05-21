import styles from './styles.module.scss'
import {CustomTable} from "../../components/Shared/CustomTable";
// import {Button} from "antd";
import {useQuery} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {useStateContext} from "../../contexts";
import {IDoctor, SpecialitiesAndProcedure} from "../../types/doctor.ts";
import {addCountsToData} from "../../utils/addCountsToData.ts";
import {useMemo, useState} from "react";
import Filters from "../../components/Doctors/Filters/Filters.tsx";
import {Typography} from 'antd'

const hiddenStyles = {
    // whiteSpace: 'nowrap',
    // width: 400,
    // overflow: 'hidden',
    // textOverflow: 'ellipsis',
}
const DoctorsPage = () => {

    const {state} = useStateContext()

    const {addressId, doctor} = state

    const {specialities, query} = doctor

    const [fullVisibleFullItems] = useState<number[]>([])

    const getIsShowFull = (number: number) => {
        return fullVisibleFullItems.includes(number);

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
            render: (name: string) => <Typography.Title style={{fontSize: 15}}>{name}</Typography.Title>
        },
        {
            title: 'Специальности/Процедуры',
            key: 'specialities_and_procedures',
            dataIndex: 'specialities_and_procedures',
            render: (data: SpecialitiesAndProcedure[], _: any, index: number) => (
                <div style={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <div style={getIsShowFull(index) ? {} : hiddenStyles}>
                        {data?.map((item, index) => {
                            return `${item?.speciality}${index === data?.length - 1 ? '' : ','} `
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
    ];

    const { data, isLoading } = useQuery({
        queryKey: ['doctorsData', addressId],
        queryFn: () =>
            axiosInstance
                .get<IDoctor[]>(`partners/franchise-branches/${addressId}/doctors/`)
                .then((response) => response?.data),
        enabled: !!addressId
    });

    function filterByQueryAndSpecialities() {
        return data?.filter(item => {
            const matchesQuery = query === '' || item.full_name.toLowerCase().includes(query.toLowerCase());
            const matchesSpecialities = specialities.length === 0 ||
                specialities.every(spec => item.specialities_and_procedures?.map(item => item?.speciality).includes(spec));
            return matchesQuery && matchesSpecialities;
        });
    }

    const filteredData = useMemo(filterByQueryAndSpecialities, [specialities, query, data])

    return (
        <div className={styles.container}>
            <Filters/>
            <CustomTable
                columns={columns}
                dataSource={addCountsToData(filteredData ?? [])}
                loading={isLoading}
            />
        </div>
    );
};

export default DoctorsPage;
