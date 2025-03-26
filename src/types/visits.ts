export interface IVisit {
  id: number;
  doctor_procedure_price: number;
  clinic: Clinic;
  date: string;
  is_child: boolean;
  doctor_profile: IDoctorProfile;
  patient: Patient;
  doctor_procedure: DoctorProcedure;
  note: string;
  is_paid: boolean;
  visit_status: VisitStatus;
  visit_time_slot: VisitTimeSlot;
  created_at: string;
  updated_at: string;

  approved_by_clinic: boolean;
  approved_by_admin: boolean;
}
export interface VisitStatus {
  id: number;
  title: string;
}
export interface VisitTimeSlot {
  id: number;
  start_time: string;
  end_time: string;
}
export interface Clinic {
  id: number;
  title: string;
  slug: string;
  address: string;
  city: string;
}
export interface IDoctorProfile {
  id: number;
  slug: string;
  full_name: string;
}
export interface Patient {
  id: number;
  full_name: string;
  birth_date: string;
  iin_number: string;
  phone_number: string;
}
export interface DoctorProcedure {
  id: number;
  medical_procedure: MedicalProcedure;
}

export interface MedicalProcedure {
  id: number;
  title: string;
}

export interface Status {
  id: number;
  status_title: string;
  status_description: string;
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
  id?: number;
}
// export interface IVisitById {
//   // clinic_branch_id: number;
//   // clinic_branch_title: string;
//   // date: string;
//   // is_child: boolean;
//   // note: string;
//   // paid: boolean;
//   // doctor_id: number;
//   // doctor_full_name: string;
//   // patient_id: number;
//   // patient_full_name: string;
//   // patient_birth_date: string;
//   // patient_iin_number: any;
//   // patient_phone_number: string;
//   // doctor_procedure_id: number;
//   // medical_procedure_id: number;
//   // medical_procedure_title: string;
//   // visit_id: number;
//   // visit_price: any;
//   // status: Status;
//   // visit_time_slot: string;
//   // created_at: string;
//   // updated_at: string;
//   // approved_by_clinic: boolean;
//   // approved: boolean;
//   id: number;
//   clinic: Clinic;
//   date: string;
//   is_child: boolean;
//   doctor_profile: IDoctorProfile;
//   patient: Patient;
//   doctor_procedure: DoctorProcedure;
//   doctor_procedure_price: number;
//   visit_status: VisitStatus;
//   visit_time_slot: VisitTimeSlot;
//   created_at: string;
//   updated_at: string;
//   approved_by_clinic: boolean;
//   approved_by_admin: boolean;
//   is_paid: boolean;
//   note: string;
// }
