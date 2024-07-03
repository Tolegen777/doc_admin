export interface IGetMonthlySummariesById {
    count: number
    next: string
    previous: any
    results: IMonthlySummariesById
}

export interface IMonthlySummariesById {
    visits: Visit[]
    total_visits_count: number
    total_visits_count_approved_by_us: number
    total_visits_count_approved_by_clinic: number
}

export interface Visit {
    approved: boolean
    approved_by_clinic: boolean
    clinic_branch_id: number
    clinic_branch_title: string
    created_at: string
    date: string
    doctor_full_name: string
    doctor_id: number
    doctor_procedure_id: number
    is_child: boolean
    medical_procedure_id: number
    note: string
    paid: boolean
    patient_birth_date: string
    patient_full_name: string
    patient_id: number
    patient_iin_number: any
    patient_phone_number: string
    procedure_title: string
    status: Status
    updated_at: string
    visit_id: number
    visit_price: any
    visit_time_slot: string
}

export interface Status {
    status_id: number
    status_description: string
    status_title: string
}
