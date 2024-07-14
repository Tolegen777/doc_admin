export interface IReview {
    id: number
    author: number
    patient_name: string
    visit: number
    visit_date: string
    doctor_name: string
    procedure_title: string
    text: string
    rating: number
    is_reply: boolean
    parent_comment: number
    has_replies: boolean
    created_at: string
    updated_at: string
    author_name: string
}

export interface IReviewPayload {
    text: string
    rating: number
    is_reply: boolean
    id?: number
}
