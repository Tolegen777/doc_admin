import DoctorBaseInfo from "../../components/Doctors/DoctorBaseInfo/DoctorBaseInfo.tsx";
import DoctorAdditionalDataTable
    from "../../components/Doctors/DoctorAdditionalDataTable/DoctorAdditionalDataTable.tsx";
import styles from './styles.module.scss'

const DoctorEditPage = () => {
    return (
        <div className={styles.container}>
            <DoctorBaseInfo/>
            <DoctorAdditionalDataTable/>
        </div>
    );
};

export default DoctorEditPage;
