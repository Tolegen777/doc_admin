import DoctorAdditionalDataTable from "../../components/Doctors/DoctorAdditionalDataTable/DoctorAdditionalDataTable.tsx";
import styles from "./styles.module.scss";
import { axiosInstance } from "../../api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { FullSpinner } from "../../components/Shared/FullSpinner";
import DoctorBaseInfo2 from "../../components/AllDoctors/DoctorBaseInfo2/DoctorBaseInfo2.tsx";
import { IDoctor } from "../../types/doctor.ts";

const DoctorEditPage2 = () => {
  const pathname = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["allDoctorByIDData", pathname?.id],
    queryFn: () =>
      axiosInstance
        .get<IDoctor>(`employee_endpoints/doctors/${pathname?.id}`)
        .then((response) => {
          return response?.data;
        }),
    enabled: !!pathname?.id?.length,
  });

  if (isLoading) {
    return <FullSpinner />;
  }

  return (
    <div className={styles.container}>
      <DoctorBaseInfo2 doctorDetails={data} />
      <DoctorAdditionalDataTable doctorDetails={data} />
    </div>
  );
};

export default DoctorEditPage2;
