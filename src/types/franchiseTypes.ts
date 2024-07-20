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

export interface IFranchiseCreateUpdate {
    id?: number
    title: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    city: number;
}


export interface IFranchiseResponce {
    id: number;
    title: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    city: number;
    photos: Photo[];
    working_hours: Workinghour[];
    amenities: Amenity[];
}
interface Amenity {
    clinic_branch: number;
    amenity: number;
}
interface Workinghour {
    id: number;
    day_of_week: string;
    open_time: string;
    close_time: string;
    created_at: string;
    updated_at: string;
    branch: number;
}
interface Photo {
    id: number;
    branch: number;
    photo: string;
    title_code: string;
    photo_url: string;
}

export interface IFranchisePhoto {
    id: number;
    branch: number;
    photo: string;
    title_code: string;
    photo_url: string;
}
