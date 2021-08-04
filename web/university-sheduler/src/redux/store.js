import { createStore, combineReducers } from "redux";
import { commonReducer } from "./common/reducer";
const rootReducer = combineReducers({ commonReducer });
export const store = createStore(rootReducer);
