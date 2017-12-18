import { initialState } from "~/store/reducers/auth";

export const isLogged = state => state.auth.loggedIn;

export const getToken = state => state.auth.token;

export const getTokenInfo = state => ({
  refreshToken: state.auth.refresh_token,
  expired: state.auth.token_expires_at
});

export const getCustomer = state =>
  state.auth.customer || initialState.customer;

export const getAddress = state => state.auth.address || initialState.address;

export const getConfig = state => state.auth.config;

export const getFilters = state => state.auth.filters;
