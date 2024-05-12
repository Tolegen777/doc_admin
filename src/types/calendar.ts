export interface ICalendar {
    doctor: string
    work_schedule: WorkSchedule[]
}

export interface WorkSchedule {
    clinic_branch?: string
    date: string
    doctor_work_schedule_object_id?: number
    working_hours: WorkingHour[]
}

export interface WorkingHour {
    working_hour: string
    appointment_duration: string
    availability: string
    patients_visit_object_id?: string
    time_passed: string
}
