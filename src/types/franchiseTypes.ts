export interface IFranchise {
    id: number
    title: string
    address: string
    latitude: number
    longitude: number
    franchise: number
    city: number
}

export interface IFranchiseInfo {
    id: number
    title: string
    full_description: string
    short_description: string
    created_at: string
    updated_at: string
    managing_team: number
}
