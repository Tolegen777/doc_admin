export interface ISpec {
  doctor: string;
  speciality: ISpecContent;
  is_active: boolean;
  available_medical_procedures: IMedProcedures[];
  doctor_procedures: DoctorProcedure[];
  id: number;
}

export interface ISpecContent {
  created_at: string;
  description: string;
  id: number;
  slug: string;
  title: string;
  updated_at: string;
}

export interface DoctorProcedure {
  id: number;
  med_proc_info: IMedProcedures;
  is_active: boolean;
  comission_amount: number;
  price: IPrice;
}

export interface IMedProcedures {
  id: number;
  title: string;
  slug: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface IPrice {
  id: number;
  is_active: boolean;
  price_date: Date;
  default_price: number;
  discount: number;
  final_price: number;
  is_for_children: boolean;
  child_age_from: ChildAgeFrom | null;
  child_age_to: null | string;
  created_at: Date;
  updated_at: Date;
}

export enum ChildAgeFrom {
  The1Год = "1 год",
  The1Мес = "1 мес.",
  The6Мес = "6 мес.",
}

export interface IAllSpec {
  id: number;
  title: string;
  slug: string;
  // medical_speciality_description: string;
  medical_speciality_procedures: MedicalSpecialityProcedure[];
}

export interface MedicalSpecialityProcedure {
  medical_procedure_id: number;
  medical_procedure_title: string;
  medical_procedure_slug: string;
  medical_procedure_description: string;
}

export interface ICreateSpec {
  med_spec_id: number;
  is_active: boolean;
}

export interface IUpdateSpec {
  id: number;
  med_spec_id: number;
  is_active: boolean;
}
