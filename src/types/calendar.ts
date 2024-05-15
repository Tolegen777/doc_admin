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
}

export interface WorkingHour {
    start_time: string
    appointment_duration: string
    availability: boolean
    patients_visit_object_id?: number
    time_passed: boolean
}

export type PanelColourType = 'red' | 'green' | 'white'
