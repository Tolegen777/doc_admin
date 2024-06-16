import styles from './styles.module.scss'
import {Button} from "antd";
import {Switch} from 'antd';
import {useNavigate} from "react-router-dom";
import userIcon from '../../../assets/userIcon.svg'
import {changeFormFieldsData} from "../../../utils/changeFormFieldsData.ts";
import {FormInitialFieldsParamsType} from "../../../types/common.ts";
import {useStateContext} from "../../../contexts";
import {ICreateUpdateDoctor, IDoctor} from "../../../types/doctor.ts";
import {datePickerFormatter} from "../../../utils/date/getDates.ts";
import GapContainer from "../../Shared/GapContainer/GapContainer.tsx";
import {axiosInstance} from "../../../api";
import {customNotification} from "../../../utils/customNotification.ts";
import {useMutation} from "@tanstack/react-query";

type Props = {}

const initialValues: FormInitialFieldsParamsType[] = [
    {
        name: 'first_name',
        value: ''
    },
    {
        name: 'last_name',
        value: ''
    },
    {
        name: 'patronymic_name',
        value: '',
    },
    {
        name: 'description',
        value: ''
    },
    {
        name: 'category',
        value: null
    },
    {
        name: 'gender',
        value: null
    },
    {
        name: 'works_since',
        value: null
    },
    {
        name: 'for_child',
        value: false
    },
    {
        name: 'is_active',
        value: false
    },
];

const DoctorBaseInfo = ({}: Props) => {

    const navigate = useNavigate()

    const {state, dispatch} = useStateContext()

    const {doctorData, addressId} = state

    const {
        mutate: onUpdate,
        isPending: isUpdateLoading,
    } = useMutation({
        mutationKey: ['updateDoctor'],
        mutationFn: (body: ICreateUpdateDoctor) => {
            return axiosInstance.put(`partners/franchise-branches/${addressId}/doctors/${doctorData?.id}/`, body)
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Изменеия успешно сохранены!'
            })
        },
    });

    const onChange = (checked: boolean) => {
        console.log(`switch to ${checked}`);
    };

    const onClick = () => {
        navigate('survey')

        dispatch(
            {
                type: 'SET_DOCTOR_SURVEY_DATA',
                payload: changeFormFieldsData<IDoctor>(initialValues, {
                    ...state?.doctorData,
                    works_since: datePickerFormatter(state?.doctorData?.works_since as string) ?? '',
            } as IDoctor)
            }
        )
    };

    return (
        <div className={styles.container}>
            <div className={styles.container_avatar}>
                <img src={userIcon} alt='' width={100} height={100}/>
            </div>
            <div className={styles.container_info}>
                <div className={styles.container_info_title}>
                    {doctorData?.full_name}
                </div>
                {doctorData?.specialities.map((item, index) => <div
                    key={item?.id}
                    className={styles.container_info_sub_title}
                >
                        {item?.speciality}{index < doctorData?.specialities?.length ? ',': ''}
                </div>
                )}
                <GapContainer gap={10}>
                    <div className={styles.container_info_sub_title}>h3. Ant Design 2</div>
                    <div className={styles.container_info_sub_title}>h3. Ant Design 2</div>
                </GapContainer>
                    <div className={styles.container_info_action}>
                        <div className={styles.container_info_sub_title}>Активен</div>
                        <Switch checked={doctorData?.is_active} onChange={onChange}/>
                    </div>
                <Button
                    type={"primary"}
                    onClick={onClick}
                    className={styles.container_info_edit}
                >
                    Редактировать анкетные данные
                </Button>
            </div>
        </div>
    );
};

export default DoctorBaseInfo;
