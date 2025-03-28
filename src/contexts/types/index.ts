import React from "react";
import { ISlotPayload } from "../../types/calendar.ts";
import { FormInitialFieldsParamsType } from "../../types/common.ts";

export type State = {
  authUser: boolean;
  searchQuery: string;
  page: number;
  addressId: number | null;
  addressSlug: string | null;
  doctor: {
    query: string;
    specialities: string[];
  };
  visitsQuery: string;
  slot: ISlotPayload;
  selectedTimeSlotIds: number[];
  doctorSurveyData: FormInitialFieldsParamsType[];
  visitId: number | null;
};

type AuthUserActionType = {
  type: "SET_AUTH_STATUS";
  payload: boolean;
};

type SetPageActionType = {
  type: "SET_PAGE";
  payload: number;
};

type SetSearchQueryActionType = {
  type: "SET_SEARCH_QUERY";
  payload: string;
};

type SetAddressIdActionType = {
  type: "SET_ADDRESS_ID";
  payload: number;
};
type SetAddressSlugActionType = {
  type: "SET_ADDRESS_SLUG";
  payload: string;
};

type SetDoctorSearchQueryActionType = {
  type: "SET_DOCTOR_SEARCH_QUERY";
  payload: string;
};

type SetDoctorSpecilititesActionType = {
  type: "SET_DOCTOR_SPECIALITIES_QUERY";
  payload: string[];
};

type SetVisitsQueryActionType = {
  type: "SET_VISITS_QUERY";
  payload: string;
};

type SetSlotDataActionType = {
  type: "SET_SLOT_DATA";
  payload: ISlotPayload;
};

type SetSelectedTimeSlotIdsActionType = {
  type: "SET_SELECTED_TIME_SLOTS_IDS";
  payload: number[];
};

type AddSelectedTimeSlotIdsActionType = {
  type: "ADD_SELECTED_TIME_SLOTS_IDS";
  payload: number[];
};

type SetDoctorSurveyDataActionType = {
  type: "SET_DOCTOR_SURVEY_DATA";
  payload: FormInitialFieldsParamsType[];
};

type SetVisitIdActionType = {
  type: "SET_VISIT_ID";
  payload: number | null;
};

export type Action =
  | AuthUserActionType
  | SetPageActionType
  | SetSearchQueryActionType
  | SetAddressIdActionType
  | SetDoctorSearchQueryActionType
  | SetDoctorSpecilititesActionType
  | SetVisitsQueryActionType
  | SetSlotDataActionType
  | SetSelectedTimeSlotIdsActionType
  | AddSelectedTimeSlotIdsActionType
  | SetDoctorSurveyDataActionType
  | SetAddressSlugActionType
  | SetVisitIdActionType;

export type Dispatch = (action: Action) => void;

export type StateContextProviderProps = { children: React.ReactNode };
