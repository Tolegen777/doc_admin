import DoctorBaseInfo from "../../components/Doctors/DoctorBaseInfo/DoctorBaseInfo.tsx";
import DoctorAdditionalDataTable
    from "../../components/Doctors/DoctorAdditionalDataTable/DoctorAdditionalDataTable.tsx";

const DoctorEditPage = () => {
    return (
        <div>
            <DoctorBaseInfo/>
            <DoctorAdditionalDataTable/>
        </div>
    );
};

export default DoctorEditPage;
