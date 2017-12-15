import { takeLatest, takeEvery, all, put, call } from "redux-saga/effects";

import i18n from "~/i18n";

import api from "~/store/api";
import { createRequestSaga, takeRequest } from "~/store/sagas/common";
import { setToast, forwardTo } from "~/store/actions/common";

import {
  setAuthState,
  saveLoggedUser,
  removeLoggedUser,
  // deleteAddress,
  saveRefreshToken,
  updateCustomer,
  addAddress,
  updateAddress
} from "~/store/actions/auth";

import { REFRESH_TOKEN } from "~/store/constants/actions";

// const requestLoginFacebook = createRequestSaga({
//   request: api.auth.loginFacebook,
//   key: 'loginFacebook',
//   cancel: 'app/logout',
//   success: [
//     (data) => saveLoggedUser(data),
//     () => setAuthState(true),
//     () => setToast('Logged successfully!!!'),
//     // () => forwardTo('/dashboard'),
//   ],
//   failure: [
//     () => setToast('Couldn\'t login', 'danger')
//   ],
// })

// const requestLoginGoogle = createRequestSaga({
//   request: api.auth.loginGoogle,
//   key: 'loginGoogle',
//   cancel: 'app/logout',
//   success: [
//     (data) => saveLoggedUser(data),
//     () => setAuthState(true),
//     () => setToast('Logged successfully!!!'),
//     // () => forwardTo('/dashboard'), // action creator may return nothing to match
//   ],
//   failure: [
//     () => setToast('Couldn\'t login', 'danger')
//   ],
// })

function* requestRefreshToken(refreshToken) {
  let forceLogout = true;
  // catch exception is safer than just read response status
  if (refreshToken) {
    try {
      // tell user to wait, no need to catch for more errors this step!!!
      yield put(setToast(i18n.t("LABEL.REFRESH_TOKEN")));
      // try refresh token, then reload page ?
      const { data: newToken, error } = yield call(
        api.auth.refreshAccessToken,
        refreshToken
      );

      if (!error) {
        forceLogout = false;
        // it can return more such as user info, expired date ?
        // call action creator to update
        yield put(saveRefreshToken(newToken));
      }
    } catch (e) {
      console.log(e);
    }
  }

  if (forceLogout) {
    // call logout user because we do not have refresh token
    yield put(setToast(i18n.t("LABEL.TOKEN_EXPIRED")));
    yield put(removeLoggedUser());
    yield put(setAuthState(false));
    yield put(forwardTo("/"));
  }
}

const requestLogin = createRequestSaga({
  request: api.auth.login,
  key: "login",
  cancel: "app/logout",
  success: [
    ({ data }) => saveLoggedUser(data),
    () => setAuthState(true),
    () => setToast("Logged successfully!!!")
    // () => forwardTo('/customer/profile'), // action creator may return nothing to match
  ],
  failure: [
    // () => setToast('Couldn\'t login', 'danger')
  ]
});

const requestSignup = createRequestSaga({
  request: api.auth.signup,
  key: "signup",
  cancel: "app/login",
  success: [() => setToast("Create Account successfully!!!")],
  failure: [() => setToast("Couldn't create account", "danger")]
});

const requestLogout = createRequestSaga({
  request: api.auth.logout,
  key: "logout",
  success: [() => setToast("Logout successfully!!!")],
  failure: [() => setToast("Couldn't logout", "danger")],
  stop: [
    () => removeLoggedUser(),
    () => setAuthState(false),
    () => forwardTo("/restaurant")
  ]
});

const requestUpdateCustomer = createRequestSaga({
  request: api.auth.updateCustomer,
  success: [
    ({ data }) => updateCustomer(data),
    () => setToast("Update customer successfully!!!")
  ],
  failure: [() => setToast("Couldn't update customer", "danger")]
});

const requestUpdateAddress = createRequestSaga({
  request: api.auth.updateAddress,
  success: [({ data }) => updateAddress(data)]
});

const requestAddAddress = createRequestSaga({
  request: api.auth.addAddress,
  success: [({ data }) => addAddress(data)]
});

const requestDeleteAddress = createRequestSaga({
  request: api.auth.deleteAddress
});

const requestResetPassword = createRequestSaga({
  request: api.auth.resetPassword
});

// root saga reducer
const asyncAuthWatchers = [
  // like case return, this is take => call
  // inner function we use yield*
  // from direct watcher we just yield value
  function* asyncLoginFetchWatcher() {
    // use takeLatest instead of take every, so double click in short time will not trigger more fork
    yield all([
      // takeLatest('app/loginFacebook', requestLoginFacebook),
      // takeLatest('app/loginGoogle', requestLoginGoogle),
      takeLatest(REFRESH_TOKEN, requestRefreshToken),
      takeLatest("app/login", requestLogin),
      takeLatest("app/signup", requestSignup),

      // customer
      takeEvery("customer/requestAddAddress", requestAddAddress),
      takeEvery("customer/requestUpdateAddress", requestUpdateAddress),
      takeEvery("customer/requestDeleteAddress", requestDeleteAddress),
      takeLatest("customer/requestUpdateCustomer", requestUpdateCustomer),
      takeLatest("customer/resetPassword", requestResetPassword),

      // actions that do not update store
      takeRequest("customer/resendPhoneCode", api.auth.resendPhoneCode),
      takeRequest("customer/verifyPhoneCode", api.auth.verifyPhoneCode)
    ]);
  },

  function* asyncLogoutFetchWatcher() {
    // use takeLatest instead of take every, so double click in short time will not trigger more fork
    yield all([takeLatest("app/logout", requestLogout)]);
  }
];

export default asyncAuthWatchers;
