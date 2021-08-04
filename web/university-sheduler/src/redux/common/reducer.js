import { AUTH, FIO_FILTER, GROUP_FILTER, ACTIVITY_FILTER } from "./constants";
const defaultState = {
  token: "",
};

export const commonReducer = (state = defaultState, action) => {
  switch (action.type) {
    case AUTH: {
      return { ...state, ...action.payload };
    }
    case FIO_FILTER: {
      return { ...state, teacher: { ...action.payload } };
    }
    case GROUP_FILTER: {
      return { ...state, groupFilter: { ...action.payload } };
    }
    case ACTIVITY_FILTER: {
      return { ...state, activityFilter: { ...action.payload } };
    }
    default: {
      return state;
    }
  }
};
