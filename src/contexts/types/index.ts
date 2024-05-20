import React from "react";

export type State = {
  authUser: boolean
  searchQuery: string
  page: number
  addressId: number | null
  doctor: {
    query: string,
    specialities: string[]
  }
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

export type Action = AuthUserActionType | SetPageActionType | SetSearchQueryActionType |
    SetAddressIdActionType | SetDoctorSearchQueryActionType | SetDoctorSpecilititesActionType

export type Dispatch = (action: Action) => void;

export type StateContextProviderProps = { children: React.ReactNode };
