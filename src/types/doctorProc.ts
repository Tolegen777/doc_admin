export interface IProc {
    id:               number;
    med_proc_info:    MedProcInfo;
    is_active:        boolean;
    comission_amount: number;
    price:            Price;
}

export interface MedProcInfo {
    id:          number;
    title:       string;
    slug:        string;
    description: string;
    created_at:  Date;
    updated_at:  Date;
}

export interface Price {
    id:              number;
    is_active:       boolean;
    price_date:      Date;
    default_price:   number;
    discount:        number;
    final_price:     number;
    is_for_children: boolean;
    child_age_from:  string;
    child_age_to:    string;
    created_at:      Date;
    updated_at:      Date;
}

export interface ICreateProc {
    med_spec_id: number,
    is_active: boolean
}

export interface IUpdateProc {
    id: number
    med_spec_id: number,
    is_active: boolean
}
