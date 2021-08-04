import { AUTH, FIO_FILTER } from "./constants";
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
    default: {
      return state;
    }
  }
};
