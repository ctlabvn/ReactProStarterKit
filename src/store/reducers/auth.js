import { REHYDRATE } from "redux-persist/constants";

/*
 * The reducer takes care of state changes in our app through actions
 */

// The initial application state, we need to store it in localStorage for later reload
// this is called static, later all state will be re-hydrate, but first time we need to know
// if this user is logged before
export const initialState = {
  loggedIn: false,
  customer: {
    language: "vi"
  },
  address: [],
  config: {},
  filters: {},
};

// Takes care of changing the application state
// state is previous state,
export const auth = (state = initialState, { type, payload }) => {
  switch (type) {
    case "app/setLanguage":
      return { ...state, customer: { ...state.customer, language: payload } };
    case 'app/updateConfig':
		  return {...state, config: {...state.config, [payload.key]: payload.value}};
    case 'app/updateFilters':
		  return {...state, filters: {...state.config, ...payload}};
    case "app/setAuthState":
      return { ...state, loggedIn: payload };
    case "app/saveLoggedUser":
      return { ...state, ...payload }; // {user,token}
    case "app/removeLoggedUser":
      // remove only customer and remain language for saving spaces?
      return { ...state, customer: {language: state.customer.language} };
    case "app/saveRefreshToken":
      // payload is access token
      return { ...state, token: { ...state.token, ...payload } };

    // update customer
    case "customer/updateCustomer":
      // remove address from customer data
      const {address, ...data} = payload;      
      return { ...state, customer: { ...state.customer, ...data } };
    case "customer/addAddress":
      return { ...state, address: [...state.address, payload] };
    case "customer/updateAddress":
      return {
        ...state,
        address: state.address.map(
          item =>
            item.cus_address_uuid === payload.cus_address_uuid
              ? { ...item, ...payload }
              : item
        )
      };

    case REHYDRATE:
      // save reject token do nothing
      const incoming = payload.auth;
      if (incoming) {
        console.log("Updated authReducer for all!!!", incoming);
        // even return the whole payload, redux still does not update the left parts
        // and transform help to convert between two sides
        return { ...state, ...incoming };
      }
      return state;

    default:
      return state;
  }
};