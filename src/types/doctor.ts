import {Dayjs} from "dayjs";

export interface IDoctor {
    id: number
    full_name: string
    short_name: string
    experience_years: number
    specialities_and_procedures: SpecialitiesAndProcedure[]
    specialities: Speciality[]
    first_name: string
    last_name: string
    patronymic_name: string
    description: string
    gender: string
    works_since: string | Dayjs
    for_child: boolean
    is_active: boolean
    created_at: string
    updated_at: string
    category: number
    franchise_employee: number
}

export interface SpecialitiesAndProcedure {
    speciality: {
        doctor_speciality_object_id: number
        is_active: boolean
        medical_speciality_id: number
        medical_speciality_title: string
    }
    procedures: string[]
}

export interface Speciality {
    doctor_profile_id: number
    doctor_speciality_object_id: number
    is_active: boolean
    medical_speciality_id: number
    medical_speciality_title: string
}

export interface ICreateUpdateDoctor {
    first_name: string,
    last_name: string,
    patronymic_name: string,
    description: string,
    category: number,
    gender: "MALE" | "FEMALE",
    works_since: any,
    for_child: boolean,
    is_active: boolean
}

export type AgeType = {
    value: string
    display: string
}

export interface ICategory {
    title: string
    slug: string
    description: string
    doctor_category_id: number
}

export interface IDoctorCreate {
    first_name: string
    last_name: string
    patronymic_name: string
    description: string
    category: number
    gender: string
    works_since: any
    for_child: boolean
    is_active: boolean
    photos: Photo[]
}

export interface Photo {
    photo: string
    title_code: string
    doctor_profile: number
}
