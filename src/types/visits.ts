export interface IVisit {
    clinic_branch_id: number
    clinic_branch_title: string
    date: string
    is_child: boolean
    note: string
    paid: boolean
    doctor_id: number
    doctor_full_name: string
    patient_id: number
    patient_full_name: string
    patient_birth_date: string
    patient_iin_number: any
    patient_phone_number: string
    doctor_procedure_id: number
    medical_procedure_id: number
    procedure_title: string
    visit_id: number
    visit_price: number
    visit_status: boolean
    visit_time_slot: string
    created_at: string
    updated_at: string
}
