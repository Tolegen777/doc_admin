export interface IDescriptionFragment {
  id: number;
  doctor_profile: number;
  title: string;
  content: string;
  ordering_number: number;
}

export interface IDescriptionFragmentCreate {
  doctor_profile: number;
  title: string;
  content: string;
  ordering_number: number;
}

export interface IDescriptionFragmentUpdate extends IDescriptionFragmentCreate {
  id: number;
}
