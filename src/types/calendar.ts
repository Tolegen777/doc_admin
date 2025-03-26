export interface ICalendar {
  doctor_fullname: string;
  doctor_id: number;
  schedule: WorkSchedule[];
}

export interface WorkSchedule {
  //   work_date: string;
  //   working_hours_count: number;
  //   visits_count: number;
  //   panel_colour: PanelColourType;

  clinic_branch_id: number;
  doctor_work_schedule_object_id: number | null;

  date: string;
  time_slots_count: number;
  appointments_count: number;
  tile_color: PanelColourType;
}

export interface ITimeSlot {
  clinic_branch: string;
  clinic_branch_id: number;
  clinic_branch_slug: string;
  doctor_profile: string;
  doctor_profile_id: number;
  doctor_profile_slug: string;
  doctor_work_schedule_id: number;
  work_date: string;
  working_hours_list: WorkingHoursList[];
}

export interface WorkingHoursList {
  // code: string;
  // doctor_availability: boolean;
  // start_time: string;
  // time_slot_id: number;
  // reserved: boolean;
  // patient_clinic_visit_id?: number;
  // isActive?: boolean;
  // panel_colour: "full_blue" | "empty_blue" | "grey";

  time_slot_object_id: number;
  time_slot_object_start_time: string;
  time_slot_object_end_time: string;
  reserved: boolean;
  patient_clinic_visit_id: number | null;
  panel_colour: string;
}

export interface ISlotPayload {
  doctorId?: number | null;
  workScheduleId?: number | null;
  title?: string;
  previousWorkScheduleId?: number | null;
  panelColor?: PanelColourType;
}

export interface IWorkScheduleUpdate {
  clinic: number | null;
  room?: number;
  working_hours: number[];
}

export interface IWorkScheduleCreate {
  room?: number;
  clinic: number | null;
  date: string;
  working_hours: number[];
}

export interface ITime {
  start_time: string;
  // code: string;
  end_time: string;
  id: number;
}

export type PanelColourType = "red" | "green" | "gray";
