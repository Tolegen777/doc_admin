import styles from './styles.module.scss'
import userIcon from '../../../assets/userIcon.svg'
import {useStateContext} from "../../../contexts";
import GapContainer from "../../Shared/GapContainer/GapContainer.tsx";

type Props = {}

// const initialValues: FormInitialFieldsParamsType[] = [
//     {
//         name: 'first_name',
//         value: ''
//     },
//     {
//         name: 'last_name',
//         value: ''
//     },
//     {
//         name: 'patronymic_name',
//         value: '',
//     },
//     {
//         name: 'description',
//         value: ''
//     },
//     {
//         name: 'category',
//         value: null
//     },
//     {
//         name: 'gender',
//         value: null
//     },
//     {
//         name: 'works_since',
//         value: null
//     },
//     {
//         name: 'for_child',
//         value: false
//     },
//     {
//         name: 'is_active',
//         value: false
//     },
// ];

const DoctorBaseInfo = ({}: Props) => {

    // const navigate = useNavigate()

    const {state} = useStateContext()

    const {doctorData} = state

    // const {
    //     mutate: onUpdate,
    //     isPending: isUpdateLoading,
    // } = useMutation({
    //     mutationKey: ['updateDoctor'],
    //     mutationFn: (body: ICreateUpdateDoctor) => {
    //         return axiosInstance.put(`partners/franchise-branches/${addressId}/doctors/${doctorData?.id}/`, body)
    //     },
    //     onSuccess: () => {
    //         customNotification({
    //             type: 'success',
    //             message: 'Изменеия успешно сохранены!'
    //         })
    //     },
    // });

    // const onClick = () => {
    //     navigate('survey')
    //
    //     dispatch(
    //         {
    //             type: 'SET_DOCTOR_SURVEY_DATA',
    //             payload: changeFormFieldsData<IDoctor>(initialValues, {
    //                 ...state?.doctorData,
    //                 works_since: datePickerFormatter(state?.doctorData?.works_since as string) ?? '',
    //         } as IDoctor)
    //         }
    //     )
    // };

    return (
        <div className={styles.container}>
            <div className={styles.container_avatar}>
                <img src={userIcon} alt='' width={100} height={100}/>
            </div>
            <div className={styles.container_info}>
                <div className={styles.container_info_title}>
                    {doctorData?.full_name}
                </div>
                <div className={styles.container_specs}>
                    {doctorData?.specialities.map((item, index) => <div
                            key={item?.doctor_profile_id}
                            className={styles.container_info_sub_title}
                        >
                            {item?.medical_speciality_title}{index + 1 < doctorData?.specialities?.length ? ',': ''}
                        </div>
                    )}
                </div>
                <GapContainer gap={10}>
                    <div className={styles.container_info_sub_title}>Стаж: {doctorData?.experience_years} лет</div>
                    {/*<div className={styles.container_info_sub_title}>Пол</div>*/}
                </GapContainer>
                    <div className={styles.container_info_action}>
                        <div className={styles.container_info_sub_title}>{doctorData?.is_active ? 'Активен' : 'Неактивен'}</div>
                        {/*<Switch checked={doctorData?.is_active} onChange={onChange}/>*/}
                    </div>
                {/*<Button*/}
                {/*    type={"primary"}*/}
                {/*    onClick={onClick}*/}
                {/*    className={styles.container_info_edit}*/}
                {/*>*/}
                {/*    Редактировать анкетные данные*/}
                {/*</Button>*/}
            </div>
        </div>
    );
};

export default DoctorBaseInfo;
