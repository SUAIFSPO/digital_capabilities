import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from "redux-logger";
import { commonReducer } from "./common/reducer";
const rootReducer = combineReducers({ commonReducer });
export const store = createStore(rootReducer, applyMiddleware(logger));
