import React from "react";

export type State = {
  authUser: boolean
  searchQuery: string
  page: number
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

export type Action = AuthUserActionType | SetPageActionType | SetSearchQueryActionType

export type Dispatch = (action: Action) => void;

export type StateContextProviderProps = { children: React.ReactNode };
