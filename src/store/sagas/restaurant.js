import { takeLatest, takeEvery, all } from "redux-saga/effects";

import api from "~/store/api";
import { setToast } from "~/store/actions/common";
import { saveRestaurants } from "~/store/actions/restaurant";

import { createRequestSaga } from "~/store/sagas/common";

const getOutlets = createRequestSaga({
  request: api.restaurant.getOutlets,
  key: "getRestaurantOutlet",
  success: [data => saveRestaurants(data)],
  failure: [() => setToast("Couldn't get data", "danger")]
});

// root saga reducer
export default [
  // watcher for schedule, define term here
  function* asyncUserFetchWatcher() {
    // use takeLatest instead of take every, so double click in short time will not trigger more fork
    yield all([takeLatest("restaurant/getOutlets", getOutlets)]);
  }
];