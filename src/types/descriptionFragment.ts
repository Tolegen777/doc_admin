export interface IDescriptionFragment {
    id: number;
    doctor: number;
    title: string;
    content: string;
    number: number;
}

export interface IDescriptionFragmentCreate {
    doctor: number;
    title: string;
    content: string;
    number: number;
}

export interface IDescriptionFragmentUpdate extends IDescriptionFragmentCreate {
    id: number
}
