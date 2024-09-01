import styles from './styles.module.scss'
import GapContainer from "../../Shared/GapContainer/GapContainer.tsx";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";
import {IAllDoctors} from "../../../types/allDoctors.ts";

type Props = {
    doctorDetails:  IAllDoctors | undefined
}

const DoctorBaseInfo2 = ({doctorDetails}: Props) => {

    const navigate = useNavigate()

    const onClick = () => {
        navigate('survey')
    };

    const onGoToDescriptionPage = () => {
        navigate('description')
    };

    const onGoToDoctorSchedulePage = () => {
        navigate('schedule')
    }

    const onGoToDoctorPhotoPage = () => {
        navigate('photo')
    }

    return (
        <div className={styles.container}>
            <div className={styles.container_avatar}>
                <img src={doctorDetails?.latest_photo} alt=''/>
            </div>
            <div className={styles.container_info}>
                <div className={styles.container_info_title}>
                    {doctorDetails?.full_name}
                </div>
                <div className={styles.container_specs}>
                    {doctorDetails?.specialities.map((item, index) => <div
                            key={index}
                            className={styles.container_info_sub_title}
                        >
                            {item}{index + 1 < doctorDetails?.specialities?.length ? ',': ''}
                        </div>
                    )}
                </div>
                <GapContainer gap={10}>
                    <div className={styles.container_info_sub_title}>Стаж: {doctorDetails?.experience_years} лет</div>
                    {/*<div className={styles.container_info_sub_title}>Пол</div>*/}
                </GapContainer>
                    <div className={styles.container_info_action}>
                        <div className={styles.container_info_sub_title}>{doctorDetails?.is_active ? 'Активен' : 'Неактивен'}</div>
                        {/*<Switch checked={doctorData?.is_active} onChange={onChange}/>*/}
                    </div>
                <div className={styles.container_actions}>
                    <div>
                        <Button
                            type={"primary"}
                            onClick={onClick}
                            className={styles.container_info_edit}
                        >
                            Редактировать анкетные данные
                        </Button>
                        <Button
                            type={"primary"}
                            onClick={onGoToDescriptionPage}
                            className={styles.container_info_edit}
                        >
                            {doctorDetails?.description_fragments ? 'Изменить описание' : 'Добавить описание'}
                        </Button>
                    </div>
                    <div>
                        <Button
                            type={"primary"}
                            onClick={onGoToDoctorSchedulePage}
                            className={styles.container_info_edit}
                        >
                            {'Управление расписанием врача'}
                        </Button>
                        <Button
                            type={"primary"}
                            onClick={onGoToDoctorPhotoPage}
                            className={styles.container_info_edit}
                        >
                            {'Управление фотографиями врача'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorBaseInfo2;
