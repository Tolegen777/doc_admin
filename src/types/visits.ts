// Дополнительные типы для детальной страницы записи

export interface IClinic {
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

export interface IPatient {
  id: number;
  full_name: string;
  birth_date: string;
  phone_number: string;
  iin_number?: string;
}

export interface IVisitStatus {
  id: number;
  title: string;
}

export interface IVisitTimeSlot {
  id: number;
  start_time: string;
  end_time: string;
}

export interface IMedicalProcedure {
  title: string;
}

export interface IDoctorProcedure {
  medical_procedure: IMedicalProcedure;
  id?: number
}

// Базовый интерфейс записи
export interface IVisit {
  id: number;
  date: string;
  is_child: boolean;
  doctor_profile: IDoctorProfile;
  patient: IPatient;
  doctor_procedure?: IDoctorProcedure;
  visit_status: IVisitStatus;
  visit_time_slot: IVisitTimeSlot;
  created_at: string;
  updated_at: string;
  approved_by_clinic: boolean;
  is_paid: boolean;
  note?: string;
  approved_by_admin?:boolean
  clinic?: any
  doctor_procedure_price?:any
}

// Расширенный интерфейс для детальной страницы
export interface IVisitDetail extends IVisit {
  clinic: IClinic;
  doctor_procedure_price: number | null;
  approved_by_admin: boolean;
}

// Интерфейс для создания/обновления записи
export interface IVisitCreate {
  id?: number;
  date: any; // dayjs object or string
  is_child: boolean;
  note?: string;
  is_paid: boolean;
  approved_by_clinic: boolean;
  visit_status: number | null;
}
