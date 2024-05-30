export interface ICalendar {
    doctor: string
    work_schedule: WorkSchedule[]
}

export interface WorkSchedule {
    work_date: string
    clinic_branch_id: number
    doctor_work_schedule_object_id: number
    working_hours_count: number
    visits_count: number
    panel_colour: PanelColourType
    doctor_id: number
}

export interface ITimeSlot {
    doctor_work_schedule_detailed_api_view: DoctorWorkScheduleDetailedApiView
}

export interface DoctorWorkScheduleDetailedApiView {
    clinic_branch: string
    clinic_branch_id: number
    doctor_profile: string
    doctor_profile_id: number
    doctor_work_schedule_id: number
    work_date: string
    working_hours_list: WorkingHoursList[]
}

export interface WorkingHoursList {
    code: string
    doctor_availability: boolean
    start_time: string
    time_slot_id: number
    reserved: boolean
    patient_clinic_visit_id?: number
    isActive?: boolean
}

export interface ISlotPayload {
    doctorId?: number | null,
    workScheduleId?: number | null,
    title?: string,
    previousWorkScheduleId?: number | null,
}


export type PanelColourType = 'red' | 'green' | 'white'
