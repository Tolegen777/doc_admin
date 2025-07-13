import { CustomTable } from "../../components/Shared/CustomTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../api";
import { useState } from "react";
import { FormInitialFieldsParamsType, IGet } from "../../types/common.ts";
import { Button, Drawer, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { DoctorCreateForm } from "../../components/Doctors/DoctorCreateForm/DoctorCreateForm.tsx";
import { customNotification } from "../../utils/customNotification.ts";
import styles from "./styles.module.scss";
import { formatDateToString } from "../../utils/date/getDates.ts";
import { IFranchise } from "../../types/franchiseTypes.ts";
// import {
//   IAllDoctors,
//   ICategory2,
//   ICreateDoctors,
//   IProcedure2,
//   ISpeciality2,
// } from "../../types/allDoctors.ts";
import { IAllSpec } from "../../types/doctorSpec.ts";
import { selectOptionsParser } from "../../utils/selectOptionsParser.ts";
import ShowMoreContainer from "../../components/Shared/ShowMoreContainer/ShowMoreContainer.tsx";
import { objectToQueryParams } from "../../utils/objectToQueryParams.ts";
import AllDoctorsFilter from "../../components/AllDoctors/AllDoctorsFilter/AllDoctorsFilter.tsx";
import {
  Clinic,
  ICategory,
  ICreateUpdateDoctor,
  IDoctor,
  Procedure,
  Speciality,
} from "../../types/doctor.ts";
import {useStateContext} from "../../contexts";

const initialValues: FormInitialFieldsParamsType[] = [
  {
    name: "first_name",
    value: "",
  },
  {
    name: "last_name",
    value: "",
  },
  {
    name: "patronymic_name",
    value: "",
  },
  {
    name: "description",
    value: "",
  },
  {
    name: "categories",
    value: [],
  },
  {
    name: "city",
    value: null,
  },
  {
    name: "gender",
    value: null,
  },
  {
    name: "works_since",
    value: "",
  },
  {
    name: "for_child",
    value: false,
  },
  {
    name: "is_active",
    value: false,
  },
  {
    name: "is_top",
    value: null,
  },
];

const DoctorsPage2 = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {state} = useStateContext()

  const [page, setPage] = useState(1);
  const [createUpdateModalOpen, setCreateUpdateModalOpen] =
    useState<boolean>(false);
  const [createUpdateFormInitialFields, setCreateUpdateFormInitialFields] =
    useState<FormInitialFieldsParamsType[]>(initialValues);
  const [params, setParams] = useState<string>("");

  const { mutate: onCreate, isPending: isCreateLoading } = useMutation({
    mutationKey: ["createDoctor"],
    mutationFn: (body: ICreateUpdateDoctor) => {
      return axiosInstance.post(`partners/franchise-info/all-doctors/`, body);
    },
    onSuccess: () => {
      customNotification({
        type: "success",
        message: "Врач успешно создан!",
      });
      queryClient.invalidateQueries({ queryKey: ["doctorsData"] });
    },
  });

  const { mutate: onDeleteDoctor, isPending: isDeleteLoading } = useMutation({
    mutationKey: ["deleteDoctor"],
    mutationFn: (id: number) =>
      axiosInstance.delete(`employee_endpoints/doctors/${id}/`),
    onSuccess: () => {
      customNotification({
        type: "success",
        message: "Врач успешно удален!",
      });
      queryClient.invalidateQueries({ queryKey: ["doctorsData"] });
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["doctorsData", page, params],
    queryFn: () =>
      axiosInstance
        .get<IGet<IDoctor>>(`employee_endpoints/clinics/${state?.addressId}/doctors/?page=${page}${params}`)
        .then((response) => response?.data),
    enabled: !!state?.addressId,
  });

  const { data: clinics, isLoading: clinicsLoading } = useQuery({
    queryKey: ["franchiseBranches"],
    queryFn: () =>
      axiosInstance
        .get<IFranchise[]>("employee_endpoints/clinics/?page_size=100")
        .then((response) => response.data),
    refetchOnMount: false,
  });

  const { data: cities, isLoading: citiesLoading } = useQuery({
    queryKey: ["doctorCitiesData"],
    queryFn: () =>
      axiosInstance
        .get("patients_endpoints/cities/")
        .then((response) => response.data),
    refetchOnMount: false,
  });

  const { data: allSpecsList, isLoading: allSpecLoading } = useQuery({
    queryKey: ["allSpecsList"],
    queryFn: () =>
      axiosInstance
        .get<IAllSpec[]>(`employee_endpoints/doctors/list_of_all_specialities/`)
        .then((response) => response?.data),
  });

  const { data: categories, isLoading: categoryLoading } = useQuery({
    queryKey: ["doctorCategoriesData"],
    queryFn: () =>
      axiosInstance
        .get("employee_endpoints/doctors/list_of_all_medical_categories/")
        .then((response) => response.data),
    refetchOnMount: false,
  });

  const clinicOptions = selectOptionsParser(clinics ?? [], "title", "id");
  const cityOptions = selectOptionsParser(cities ?? [], "title", "id");
  const specOptions = selectOptionsParser(allSpecsList ?? [], "title", "id");
  const categoryOptions = selectOptionsParser(categories ?? [], "title", "id");

  const handleGoEditPage = (doctorDetails: IDoctor) => {
    navigate(`/all-doctors/${doctorDetails?.id}`);
  };

  const handleDelete = (id: number) => {
    onDeleteDoctor(id);
  };

  const onClose = () => {
    setCreateUpdateModalOpen(false);
    setCreateUpdateFormInitialFields(initialValues);
  };

  const onSubmitCreateUpdateModal = async (formData: ICreateUpdateDoctor) => {
    const payload = {
      ...formData,
      // @ts-ignore
      works_since: formatDateToString(formData?.works_since?.$d) ?? "",
    };
    onCreate(payload);
    onClose();
  };

  const handleFilter = (formData: any) => {
    if (formData) {
      const urlParams = objectToQueryParams(formData);
      setParams(`&${urlParams}`);
    }
  };

  const columns = [
    {
      title: "ID",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "Фото",
      key: "main_photo",
      dataIndex: "main_photo",
      render: (photo: { id: string; url: string }) => (
        <img src={photo?.url} alt="doctor" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "ФИО",
      key: "full_name",
      dataIndex: "full_name",
    },
    // {
    //   title: "Категория",
    //   key: "category",
    //   dataIndex: "category",
    // },
    // {
    //   title: "Категорий",
    //   key: "categories",
    //   dataIndex: "categories",
    //   render: (categories: ICategory[]) => {
    //     return (
    //       <ShowMoreContainer>
    //         <div className={styles.tag_wrapper}>
    //           {categories?.map((item) => (
    //             <Tag key={item.doctor_category_id} color="#108ee9">
    //               {item?.medical_category_title}
    //             </Tag>
    //           ))}
    //         </div>
    //       </ShowMoreContainer>
    //     );
    //   },
    // },
    // {
    //   title: "Город",
    //   key: "city_title",
    //   dataIndex: "city_title",
    // },
    {
      title: "Специализации",
      key: "specialities",
      dataIndex: "specialities",
      render: (specialities: Speciality[]) => {
        return (
          <div className={styles.tag_wrapper}>
            {specialities?.map((item) => (
              <Tag key={item.medical_speciality_id} color="#108ee9">
                {item.medical_speciality_title}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Процедуры",
      key: "procedures",
      dataIndex: "procedures",
      render: (procedures: Procedure[]) => {
        return (
          <ShowMoreContainer>
            <div className={styles.tag_wrapper}>
              {procedures?.map((item) => (
                <Tag key={item.medical_procedure_id} color="#108ee9">
                  {item.medical_procedure_title}
                </Tag>
              ))}
            </div>
          </ShowMoreContainer>
        );
      },
    },
    // {
    //   title: "Опыт (лет)",
    //   key: "experience_years",
    //   dataIndex: "experience_years",
    // },
    {
      title: "Статус",
      key: "is_active",
      dataIndex: "is_active",
      render: (isActive: boolean) => (
          isActive ? 'Активен' : 'Неактивен'
      ),
    },
    // {
    //   title: "Рейтинг",
    //   key: "rating",
    //   dataIndex: "rating",
    // },
    // {
    //   title: "Филиалы клиник",
    //   key: "clinics",
    //   dataIndex: "clinics",
    //   render: (branches: Clinic[]) => (
    //     <ShowMoreContainer>
    //       {branches.map((item) => item.title).join(", ")}
    //     </ShowMoreContainer>
    //   ),
    // },
    {
      title: "Редактировать",
      render: (data: IDoctor) => (
        <Button onClick={() => handleGoEditPage(data)} type={"primary"}>
          Редактировать
        </Button>
      ),
    },
    {
      title: "Удалить",
      render: (data: IDoctor) => (
        <Button
          onClick={() => handleDelete(data?.id as number)}
          disabled={isDeleteLoading}
        >
          Удалить
        </Button>
      ),
    },
  ];

  return (
    <>
      <Drawer
        title={"Создание врача"}
        onClose={onClose}
        open={createUpdateModalOpen}
        width="90%"
      >
        <DoctorCreateForm
          formType={"create"}
          initialFields={createUpdateFormInitialFields}
          onSubmit={onSubmitCreateUpdateModal}
          onClose={onClose}
          isLoading={isCreateLoading}
        />
      </Drawer>
      <div className={styles.container}>
        {/*<div className={styles.action}>*/}
        {/*  <Button*/}
        {/*    // onClick={onOpenCreateUpdateModal}*/}
        {/*    onClick={() => navigate("create")}*/}
        {/*    type={"primary"}*/}
        {/*    size={"large"}*/}
        {/*  >*/}
        {/*    Создать*/}
        {/*  </Button>*/}
        {/*</div>*/}
        <AllDoctorsFilter
          branchesOptions={clinicOptions}
          specialitiesOptions={specOptions}
          citiesOptions={cityOptions}
          categoriesOptions={categoryOptions}
          branchesLoading={clinicsLoading}
          categoriesLoading={categoryLoading}
          citiesLoading={citiesLoading}
          specLoading={allSpecLoading}
          onFilter={handleFilter}
        />
        <CustomTable
          columns={columns}
          dataSource={data?.results ?? []}
          loading={isLoading}
          setPage={setPage}
          total={data?.count ?? 0}
          current={page}
        />
      </div>
    </>
  );
};

export default DoctorsPage2;
