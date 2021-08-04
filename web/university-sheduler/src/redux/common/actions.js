import { AUTH } from "./constants";

export const auth = (payload) => ({
  type: AUTH,
  payload,
});
