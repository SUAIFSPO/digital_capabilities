const defaultState = {};

export const commonReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "ADD": {
      return { ...state, count: state.count + action.payload };
    }
    default: {
      return state;
    }
  }
};
