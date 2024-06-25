import React from "react";
import {ISlotPayload} from "../../types/calendar.ts";
import {IDoctor} from "../../types/doctor.ts";
import {FormInitialFieldsParamsType} from "../../types/common.ts";

export type State = {
  authUser: boolean
  searchQuery: string
  page: number
  addressId: number | null
  doctor: {
    query: string,
    specialities: string[]
  }
  visitsQuery: string
  slot: ISlotPayload
  selectedTimeSlotIds: number[]
  doctorData: IDoctor | null,
  doctorSurveyData: FormInitialFieldsParamsType[]
};


type AuthUserActionType = {
  type: 'SET_AUTH_STATUS'
  payload: boolean
}

type SetPageActionType = {
  type: 'SET_PAGE'
  payload: number
}

type SetSearchQueryActionType = {
  type: 'SET_SEARCH_QUERY'
  payload: string
}

type SetAddressIdActionType = {
  type: 'SET_ADDRESS_ID'
  payload: number
}

type SetDoctorSearchQueryActionType = {
  type: 'SET_DOCTOR_SEARCH_QUERY'
  payload: string
}

type SetDoctorSpecilititesActionType = {
  type: 'SET_DOCTOR_SPECIALITIES_QUERY'
  payload: string[]
}

type SetVisitsQueryActionType = {
  type: 'SET_VISITS_QUERY'
  payload: string
}

type SetSlotDataActionType = {
  type: 'SET_SLOT_DATA'
  payload: ISlotPayload
}

type SetSelectedTimeSlotIdsActionType = {
  type: 'SET_SELECTED_TIME_SLOTS_IDS'
  payload: number[]
}

type AddSelectedTimeSlotIdsActionType = {
  type: 'ADD_SELECTED_TIME_SLOTS_IDS'
  payload: number[]
}

type SetDoctorDataActionType = {
  type: 'SET_DOCTOR_DATA'
  payload: IDoctor
}

type SetDoctorSurveyDataActionType = {
  type: 'SET_DOCTOR_SURVEY_DATA'
  payload: FormInitialFieldsParamsType[]
}

export type Action = AuthUserActionType | SetPageActionType | SetSearchQueryActionType |
    SetAddressIdActionType | SetDoctorSearchQueryActionType | SetDoctorSpecilititesActionType |
    SetVisitsQueryActionType | SetSlotDataActionType | SetSelectedTimeSlotIdsActionType |
    AddSelectedTimeSlotIdsActionType | SetDoctorDataActionType | SetDoctorSurveyDataActionType

export type Dispatch = (action: Action) => void;

export type StateContextProviderProps = { children: React.ReactNode };
