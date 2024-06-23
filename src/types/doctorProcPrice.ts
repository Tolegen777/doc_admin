export interface IDoctorProcPrice {
    id: number
    is_active: boolean
    price_date: string
    default_price: number
    discount: number
    final_price: number
    is_for_children: boolean
    child_age_from: any
    child_age_to: any
    created_at: string
    updated_at: string
}

export interface ICreatePrice {
    default_price: number,
    discount: number,
    final_price: number,
    is_for_children: boolean,
    child_age_from: string,
    child_age_to: string
}

export interface IUpdatePrice extends ICreatePrice {
    id: number
}
