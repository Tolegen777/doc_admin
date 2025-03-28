import { createContext, useContext, useReducer } from "react";

// eslint-disable-next-line prettier/prettier
import type { Dispatch, State, Action, StateContextProviderProps } from './types';
import { mergeAndRemoveDuplicates } from "../utils/mergeAndRemoveDuplicates.ts";

const initialState: State = {
  authUser: false,
  searchQuery: "",
  page: 1,
  addressId: null,
  addressSlug: null,
  doctor: {
    query: "",
    specialities: [],
  },
  visitsQuery: "",
  slot: {
    doctorId: null,
    workScheduleId: null,
    title: "",
    previousWorkScheduleId: null,
    panelColor: undefined,
  },
  selectedTimeSlotIds: [],
  doctorSurveyData: [],
  visitId: null,
};

const StateContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const stateReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_AUTH_STATUS": {
      return {
        ...state,
        authUser: action.payload,
      };
    }
    case "SET_SEARCH_QUERY": {
      return {
        ...state,
        searchQuery: action.payload,
      };
    }
    case "SET_PAGE": {
      return {
        ...state,
        page: action.payload,
      };
    }
    case "SET_ADDRESS_ID": {
      return {
        ...state,
        addressId: action.payload,
      };
    }
    case "SET_ADDRESS_SLUG": {
      return {
        ...state,
        addressSlug: action.payload,
      };
    }
    case "SET_DOCTOR_SEARCH_QUERY": {
      return {
        ...state,
        doctor: {
          ...state.doctor,
          query: action.payload,
        },
      };
    }
    case "SET_DOCTOR_SPECIALITIES_QUERY": {
      return {
        ...state,
        doctor: {
          ...state.doctor,
          specialities: action.payload,
        },
      };
    }
    case "SET_VISITS_QUERY": {
      return {
        ...state,
        visitsQuery: action.payload,
      };
    }
    case "SET_SLOT_DATA": {
      return {
        ...state,
        slot: {
          ...state.slot,
          ...action.payload,
        },
      };
    }
    case "SET_SELECTED_TIME_SLOTS_IDS": {
      return {
        ...state,
        selectedTimeSlotIds: action.payload,
      };
    }
    case "ADD_SELECTED_TIME_SLOTS_IDS": {
      return {
        ...state,
        selectedTimeSlotIds: mergeAndRemoveDuplicates(
          state.selectedTimeSlotIds,
          action.payload,
        ),
      };
    }
    case "SET_DOCTOR_SURVEY_DATA": {
      return {
        ...state,
        doctorSurveyData: action.payload,
      };
    }
    case "SET_VISIT_ID": {
      return {
        ...state,
        visitId: action.payload,
      };
    }
    default: {
      throw new Error("Unhandled action type");
    }
  }
};

const StateContextProvider = ({ children }: StateContextProviderProps) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const providerValue = { state, dispatch };

  return (
    <StateContext.Provider value={providerValue}>
      {children}
    </StateContext.Provider>
  );
};

const useStateContext = () => {
  const context = useContext(StateContext);

  if (context) {
    return context;
  }

  throw new Error("useStateContext must be used within a StateContextProvider");
};

export { StateContextProvider, useStateContext };
