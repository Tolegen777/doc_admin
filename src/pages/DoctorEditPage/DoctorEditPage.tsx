import DoctorBaseInfo from "../../components/Doctors/DoctorBaseInfo/DoctorBaseInfo.tsx";
import DoctorAdditionalDataTable from "../../components/Doctors/DoctorAdditionalDataTable/DoctorAdditionalDataTable.tsx";
import styles from "./styles.module.scss";
import { axiosInstance } from "../../api";
import { IDoctor } from "../../types/doctor.ts";
import { useStateContext } from "../../contexts";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { FullSpinner } from "../../components/Shared/FullSpinner";

const DoctorEditPage = () => {
  const { state } = useStateContext();

  const pathname = useParams();

  const { addressId } = state;

  const { data, isLoading } = useQuery({
    queryKey: ["doctorByIDData", addressId, pathname?.id],
    queryFn: () =>
      axiosInstance
        .get<IDoctor>(`employee_endpoints/doctors/${pathname?.id}`)
        .then((response) => response?.data),
    enabled: !!addressId,
  });

  if (isLoading) {
    return <FullSpinner />;
  }

  return (
    <div className={styles.container}>
      <DoctorBaseInfo doctorDetails={data} />
      <DoctorAdditionalDataTable doctorDetails={data} />
    </div>
  );
};

export default DoctorEditPage;
