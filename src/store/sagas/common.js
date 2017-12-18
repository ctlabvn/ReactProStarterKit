import jwtDecode from "jwt-decode";
import {
  select,
  call,
  put,
  take,
  race,
  takeEvery,
  takeLatest
} from "redux-saga/effects";
import { delay } from "redux-saga";

import {
  markRequestPending,
  markRequestSuccess,
  markRequestCancelled,
  markRequestFailed,
  invokeCallback,
  setToast,
  forwardTo
} from "~/store/actions/common";

import {
  removeLoggedUser,
  setAuthState,
  saveRefreshToken
} from "~/store/actions/auth";

import { getTokenInfo } from "~/store/selectors/auth";
import { API_TIMEOUT } from "~/store/constants/api";
import api from "~/store/api";
import i18n from "~/i18n";

function UnauthorizedException(message) {
  this.status = 401;
  this.message = message;
  this.toString = function() {
    return this.value + this.message;
  };
}

function* requestRefreshToken(refreshToken) {
  let forceLogout = true;
  let newToken = null;
  const timeout = API_TIMEOUT;
  // catch exception is safer than just read response status
  if (refreshToken) {
    try {
      // tell user to wait, no need to catch for more errors this step!!!
      yield put(setToast(i18n.t("LABEL.REFRESH_TOKEN")));
      // try refresh token, then reload page ?
      const { ret, isTimeout } = yield race({
        ret: call(api.auth.refreshAccessToken, refreshToken),
        isTimeout: call(delay, timeout)
      });

      const error = isTimeout ? true : ret.error;

      if (!error) {
        forceLogout = false;
        // it can return more such as user info, expired date ?
        // call action creator to update
        yield put(saveRefreshToken(ret.data));
        newToken = ret.data.token;
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

  return newToken;
}

// create saga here
// convenient way: [] instead of polymorph, such as item is not array then [item]
// because later changes to code will be so easy, just add new row
export const createRequestSaga = ({
  request,
  key,
  start,
  stop,
  success,
  failure,
  cancelled,
  timeout = API_TIMEOUT,
  cancel
}) => {
  // when we dispatch a function, redux-thunk will give it a dispatch
  // while redux-saga will give it an action instead, good for testing
  // we may not needs this if we use redux-saga, of course we can use both
  return function*(action) {
    // default is empty
    let args = action.args || [];
    // check to see if we have success callback that pass as a param, so that it will be callback from where it was born
    // with this way we can make something like cleaning the messages
    let callback =
      typeof args[args.length - 1] === "function"
        ? args[args.length - 1]
        : null;
    if (callback) {
      args = args.slice(0, -1);
    }
    // error first callback
    let ret = null;
    let err = null;

    // store into redux, default key is action type for unique name
    const requestKey =
      typeof key === "function" ? key(...args) : key || action.type;
    // for key, we render unique key using action.args
    // but for actionCreator when callback, we should pass the whole action
    // so on event such as success, we can use action.type or action.args to
    // do next, example: addBook => success : (data, {args:[token]}) => loadBooks(token)

    if (start)
      for (let i = 0; i < start.length; i++) {
        const actionCreator = start[i];
        yield put(actionCreator());
      }

    //for (let actionCreator of start) {
    //  yield put(actionCreator());
    //}
    // mark pending
    yield put(markRequestPending(requestKey));
    try {
      // this is surely Error exception, assume as a request failed
      if (!request) {
        throw new Error(i18n.t("LABEL.API_NOT_FOUND"));
      }

      if (typeof args[0] === "string" && args[0].match(/\w+\.\w+\.\w+/)) {
        try {
          const testJWT = jwtDecode(args[0]);
          if (testJWT) {
            // check access token expire, if error occur, just throw it
            const { refreshToken, expired } = yield select(getTokenInfo);
            const needRefresh = Date.now() > expired - 60000;
            if (needRefresh) {
              const newToken = yield call(requestRefreshToken, refreshToken);
              if (!newToken) {
                throw new Error(i18n.t("LABEL.CAN_NOT_REFRESH_TOKEN"));
              }
              // update newToken
              args[0] = newToken;
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
      // we do not wait forever for whatever request !!!
      // timeout is 0 mean default timeout, so default is 0 in case user input 0
      let raceOptions = {
        data: call(request, ...args),
        isTimeout: call(delay, timeout)
      };

      if (cancel) {
        raceOptions.cancelRet = take(cancel);
      }

      const { data, isTimeout, cancelRet } = yield race(raceOptions);

      if (isTimeout) {
        throw new Error(i18n.t("LABEL.API_TIMEOUT", { timeout }));
      } else if (cancelRet) {
        // callback on success
        if (cancelled)
          for (let i = 0; i < cancelled.length; i++) {
            const actionCreator = cancelled[i];
            yield put(actionCreator(cancelRet, action));
          }

        //for (let actionCreator of cancelled) {
        //  yield put(actionCreator(cancelRet, action));
        //}
        // mark cancelled request
        yield put(markRequestCancelled(cancelRet, requestKey));
      } else {
        if (data.error) {
          switch (data.error) {
            case "token_expired":
              // throw unthorized response, need translate ?
              throw new UnauthorizedException(data.error);
            default:
              throw new Error(data.error);
          }
        }

        // callback on success
        if (success)
          for (let i = 0; i < success.length; i++) {
            const actionCreator = success[i];
            yield put(actionCreator(data, action));
          }

        //for (let actionCreator of success) {
        //  yield put(actionCreator(data, action));
        //}
        // finally mark the request success
        yield put(markRequestSuccess(requestKey));

        // assign data, for cancel both ret and err is null
        ret = data;
      }
    } catch (reason) {
      // unauthorized
      if (reason.status === 401) {
        // something wrong, logout
        yield call(requestRefreshToken, null);
      }
      // anyway, we should treat this as error to log
      if (failure)
        for (let i = 0; i < failure.length; i++) {
          const actionCreator = failure[i];
          yield put(actionCreator(reason, action));
        }
      //for (let actionCreator of failure) {
      //  yield put(actionCreator(reason, action));
      //}
      yield put(markRequestFailed(reason, requestKey));

      // mark error
      err = reason;
    } finally {
      if (stop)
        for (let i = 0; i < stop.length; i++) {
          const actionCreator = stop[i];
          yield put(actionCreator(ret, action));
        }
      //for (let actionCreator of stop) {
      //  yield put(actionCreator(ret, action));
      //}
      // check if the last param is action, should call it as actionCreator
      // from where it is called, we can access action[type and args],
      // so we will use it with first error callback style
      if (callback) {
        yield put(invokeCallback(callback, err, ret));
      }
    }
  };
};

export const takeRequest = (signal, request, multiple = false) => {
  const requestSaga = createRequestSaga({ request });
  return multiple
    ? takeEvery(signal, requestSaga)
    : takeLatest(signal, requestSaga);
};
