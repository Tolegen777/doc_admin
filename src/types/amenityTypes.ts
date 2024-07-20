export interface IAmenityCreateUpdate {
    id: number
    clinic_branch: number,
    amenity: number
}

export interface IAmenityResponce {
    clinic_branch: number,
    amenity: number
    id?: number
}
