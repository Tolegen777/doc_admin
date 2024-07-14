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


export interface IVisitById {
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
    medical_procedure_title: string
    visit_id: number
    visit_price: any
    status: Status
    visit_time_slot: string
    created_at: string
    updated_at: string
    approved_by_clinic: boolean
    approved: boolean
}

export interface Status {
    id: number
    status_title: string
    status_description: string
}

export interface IVisitCreate {
    date: any;
    is_child: boolean;
    note: string;
    paid: boolean;
    approved_by_clinic: boolean;
    approved: boolean;
    doctor_id: number;
    doctor_procedure_id: number;
    visit_time_id: number;
    clinic_branch_id: number;
    patient_id: number;
    status_id: number;
    id?: number
}
