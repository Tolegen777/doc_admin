export interface IAllDoctors {
    id: number
    full_name: string
    category: string
    city: string
    specialities: string[]
    procedures: string[]
    experience_years: number
    rating: number
    clinic_branches: string[]
    latest_photo: string
}

export interface ICreateDoctors {
    first_name: string,
    last_name: string,
    patronymic_name: string,
    description: string,
    city: number,
    category: number,
    gender: string,
    works_since: string,
    for_child: boolean,
    is_active: boolean,
    is_top: boolean
}

export interface IUpdateDoctors extends ICreateDoctors{
    id: number
}


////////
export interface IAllDoctorSpec {
    doctor_speciality_id: number
    medical_speciality_title: string
    medical_speciality_id: number
    doctor_procedures_count: number
    available_procedures_count: number
    is_active: boolean
    doctor_procedures_list: AllDoctorProceduresList[]
    available_medical_procedures: AllAvailableMedicalProcedure[]
}

export interface AllDoctorProceduresList {
    medical_procedure_title: string
    current_price_object: AllCurrentPriceObject
}

export interface AllCurrentPriceObject {
    default_price: number
    discount: number
    final_price: number
    is_for_children: boolean
    child_age_from?: string
    child_age_to?: string
}

export interface AllAvailableMedicalProcedure {
    procedure_title: string
    procedure_id: number
}

export interface IAllCreateSpec {
    speciality: number
    is_active: boolean
    doctor: number
}

export interface IAllUpdateSpec {
    id: number
    is_active: boolean
}

export interface IAllDoctorProcs {
    id: number
    procedure_title: string
    current_price: AllCurrentPrice
    is_active: boolean
    price_count: number
}

export interface AllCurrentPrice {
    default_price: number
    discount: number
    final_price: number
    is_for_children: boolean
    child_age_from?: string
    child_age_to?: string
}


export interface IAllCreateProc {
    procedure: number
    is_active: boolean
    doctor: number
}

export interface IAllUpdateProc {
    id: number
    is_active: boolean
}

export interface IAllDoctorSchedule {
    id: number
    clinic_branch: string
    clinic_address: string
    clinic_branch_id: number
    work_date: string
    day_of_week: string
    working_hours: WorkingHour[]
}

export interface WorkingHour {
    id: number
    start_time: string
    code: string
}

export interface ICreateAllDoctorSchedule {
    clinic_branch: number
    work_date: string
    working_hours: number[]
}

export interface IUpdateAllDoctorSchedule extends ICreateAllDoctorSchedule{
    id: number
}
