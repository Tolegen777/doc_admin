import styles from './styles.module.scss'
import userIcon from '../../../assets/userIcon.svg'
import {useStateContext} from "../../../contexts";
import GapContainer from "../../Shared/GapContainer/GapContainer.tsx";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";

type Props = {}

const DoctorBaseInfo = ({}: Props) => {

    const navigate = useNavigate()

    const {state} = useStateContext()

    const {doctorData} = state

    const onClick = () => {
        navigate('survey')
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
