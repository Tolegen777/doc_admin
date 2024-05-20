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
    works_since: string
    for_child: boolean
    is_active: boolean
    created_at: string
    updated_at: string
    category: number
    franchise_employee: number
}

export interface SpecialitiesAndProcedure {
    speciality: string
    procedures: string[]
}

export interface Speciality {
    id: number
    is_active: boolean
    created_at: string
    updated_at: string
    doctor: number
    speciality: number
}