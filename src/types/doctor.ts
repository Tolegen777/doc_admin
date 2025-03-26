export interface IDoctor {
  id: number;
  full_name: string;
  slug: string;
  gender: string;
  city_title: string;
  city_id: number;
  is_active: boolean;
  photos_list: PhotosList[];
  main_photo: MainPhoto;
  specialities: Speciality[];
  procedures: Procedure2[];
  clinics: Clinic[];
  categories: ICategory[];
  description_fragments: DescriptionFragment[];

  experience_years: number;
  works_since: string;

  // id: number;
  // full_name: string;
  // short_name: string;
  // experience_years: number;
  // specialities_and_procedures: SpecialitiesAndProcedure[];
  // specialities: Speciality[];
  // first_name: string;
  // last_name: string;
  // patronymic_name: string;
  // description: string;
  // gender: string;
  // works_since: string | Dayjs;
  // for_child: boolean;
  // is_active: boolean;
  // created_at: string;
  // updated_at: string;
  // category: number;
  // franchise_employee: number;
  // description_fragments: DescriptionFragment[];
}

export interface Clinic {
  id: number;
  slug: string;
  title: string;
  address: string;
}

export interface PhotosList {
  id: number;
  url: string;
  title_code: string;
}

export interface MainPhoto {
  id: number;
  url: string;
  title_code: string;
}

export interface Speciality {
  medical_speciality_id: number;
  medical_speciality_title: string;
  medical_speciality_slug: string;
  doctor_speciality_id: number;
  procedures: Procedure[];

  // doctor_profile_id: number;
  // doctor_speciality_object_id: number;
  // is_active: boolean;
  // medical_speciality_id: number;
  // medical_speciality_title: string;
}

export interface Procedure {
  medical_procedure_id: number;
  medical_procedure_title: string;
  medical_procedure_slug: string;
  doctor_procedure_id: number;
  speciality_procedure_assignment_id: number;
}

export interface Procedure2 {
  medical_procedure_id: number;
  medical_procedure_title: string;
  medical_procedure_slug: string;
  doctor_procedure_id: number;
}

export interface ICategory {
  medical_category_id: number;
  medical_category_title: string;
  doctor_category_id: number;

  // title: string;
  // slug: string;
  // description: string;
  // doctor_category_id: number;
}

export interface DescriptionFragment {
  id: number;
  title: string;
  content: string;
  ordering_number: number;
}

export interface SpecialitiesAndProcedure {
  speciality: {
    doctor_speciality_object_id: number;
    is_active: boolean;
    medical_speciality_id: number;
    medical_speciality_title: string;
  };
  procedures: string[];
}

export interface ICreateUpdateDoctor {
  id?: number;
  first_name: string;
  last_name: string;
  patronymic_name: string;
  description: string;
  category: number;
  gender: "MALE" | "FEMALE";
  works_since: string;
  for_child: boolean;
  is_active: boolean;
  photos?: MainPhoto[];
}

export type AgeType = {
  value: string;
  display: string;
};

export type IDoctorPhotoCreate = Exclude<IDoctorPhotoUpdate, "id">;

export interface IDoctorPhotoUpdate {
  id?: number;
  photo: string;
  title_code: number;
  is_main: boolean;
}

// export interface Photo {
//   photo: string;
//   title_code: string;
//   doctor_profile: number;
// }

export interface IDoctorSchedule {
  id: number;
  clinic: number;
  room: number;
  date: string;
  working_hours: number[];
}

export interface IDoctorScheduleCreateUpdate {
  id?: number;
  clinic: number;
  room: number;
  date: string;
  working_hours: number[];
}
