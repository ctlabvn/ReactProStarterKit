import { initialState } from "~/store/reducers/auth";

export const isLogged = state =>
  state.auth.loggedIn

export const getToken = state => 
  state.auth.token

export const getCustomer = state => 
  state.auth.customer || initialState.customer;
  
export const getAddress = state => 
  state.auth.address || initialState.address;