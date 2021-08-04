import { AUTH, FIO_FILTER, GROUP_FILTER, ACTIVITY_FILTER } from "./constants";

export const auth = (payload) => ({
  type: AUTH,
  payload,
});

export const setFioFilter = (payload) => ({
  type: FIO_FILTER,
  payload,
});
export const setGroupFilter = (payload) => ({
  type: GROUP_FILTER,
  payload,
});
export const setActivityFilter = (payload) => ({
  type: ACTIVITY_FILTER,
  payload,
});
