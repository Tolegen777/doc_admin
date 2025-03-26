export interface IDailySummary {
  total_visit_price: number;
  total_visit_count: number;
  total_visit_comission_amount: number;
  visits: IDailyVisit[];
}

export interface IDailyVisit {
  visit_date: string;
  visit_time_slot: string;
  doctor_id: number;
  doctor_full_name: string;
  doctor_short_name: string;
  doctor_procedure_id: number;
  doctor_procedure_title: string;
  patient_phone_number: string;
  patient_iin_number: any;
  visit_status_id: number;
  visit_status_title: string;
  visit_price: string;
  visit_comission_amount: string;
}
