import styles from "./styles.module.scss";
// import userIcon from "../../../assets/userIcon.svg";
import GapContainer from "../../Shared/GapContainer/GapContainer.tsx";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { IDoctor } from "../../../types/doctor.ts";

type Props = {
  doctorDetails: IDoctor | undefined;
};

const DoctorBaseInfo = ({ doctorDetails }: Props) => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate("survey");
  };
  return (
    <div className={styles.container}>
      <div className={styles.container_avatar}>
        <img
          src={doctorDetails?.main_photo?.url}
          alt=""
          width={100}
          height={100}
        />
      </div>
      <div className={styles.container_info}>
        <div className={styles.container_info_title}>
          {doctorDetails?.full_name}
        </div>
        <div className={styles.container_specs}>
          {doctorDetails?.specialities.map((item, index) => (
            <div
              key={item?.doctor_speciality_id}
              className={styles.container_info_sub_title}
            >
              {item?.medical_speciality_title}
              {index + 1 < doctorDetails?.specialities?.length ? "," : ""}
            </div>
          ))}
        </div>
        <GapContainer gap={10}>
          <div className={styles.container_info_sub_title}>
            Стаж: {doctorDetails?.experience_years} лет
          </div>
          {/*<div className={styles.container_info_sub_title}>Пол</div>*/}
        </GapContainer>
        <div className={styles.container_info_action}>
          <div className={styles.container_info_sub_title}>
            {doctorDetails?.is_active ? "Активен" : "Неактивен"}
          </div>
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
