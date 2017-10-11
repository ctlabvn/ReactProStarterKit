import { combineReducers } from "redux";
import { routerReducer as routing } from "react-router-redux";
import { reducer as form } from "redux-form";

import { requests, toast } from "./common";
import { auth } from "./auth";
import { restaurant } from "./restaurant";

// a rootReducer is like a single state, key is function return a sub state value
export default combineReducers({
  routing,
  form, // for complex reducer, should put at root
  ui: combineReducers({
    toast
  }),
  requests,
  auth,
  restaurant
});
