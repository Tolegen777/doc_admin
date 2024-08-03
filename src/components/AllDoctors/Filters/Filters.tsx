import styles from './styles.module.scss'
import {useStateContext} from "../../../contexts";
import {useQuery} from "@tanstack/react-query";
import {CustomSearchInput} from "../../Shared/CustomSearchInput";
import {axiosInstance} from "../../../api";
import {IDoctor} from "../../../types/doctor.ts";
import {selectOptionsParser} from "../../../utils/selectOptionsParser.ts";
import {Select} from "antd";

type Props = {}
const Filters = ({}: Props) => {

    const {dispatch, state} = useStateContext()

    const {doctor} = state

    const { data, isLoading } = useQuery({
        queryKey: ['specialtiesListData'],
        queryFn: () =>
            axiosInstance
                .get<IDoctor[]>(`partners/medical-specialties-list/`)
                .then((response) => response?.data)
    });

    const handleChange = (value: string[]) => {
        dispatch({
            type: 'SET_DOCTOR_SPECIALITIES_QUERY',
            payload: value
        })
    }

    return (
        <div className={styles.container}>
                <CustomSearchInput
                    action={(value) => {
                    dispatch({type: 'SET_DOCTOR_SEARCH_QUERY', payload: value})
                }}
                />
                <Select
                    mode="tags"
                    style={{ minWidth: '200px' }}
                    placeholder="Все"
                    onChange={handleChange}
                    options={selectOptionsParser<IDoctor>(data ?? [], 'medical_speciality_title', 'medical_speciality_title')}
                    loading={isLoading}
                    popupMatchSelectWidth={false}
                    value={doctor.specialities}
                />
        </div>
    );
};

export default Filters;
