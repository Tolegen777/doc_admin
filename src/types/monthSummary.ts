export interface IMonthSummary {
  month_name: string;
  payment_status: boolean;
  summary_title: string;
  patient_clinic_visits: IPatientClinicVisits;
  editable: boolean;
  clinic_branch: number;
  start_date: string;
  end_date: string;
  id: number;
}

export interface IPatientClinicVisits {
  total_visits_count: number;
  total_visits_count_approved_by_us: number;
  total_visits_count_approved_by_clinic: number;
}
