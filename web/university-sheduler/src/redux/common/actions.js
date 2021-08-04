import { AUTH, FIO_FILTER } from "./constants";

export const auth = (payload) => ({
  type: AUTH,
  payload,
});

export const setFioFilter = (payload) => ({
  type: FIO_FILTER,
  payload,
});
