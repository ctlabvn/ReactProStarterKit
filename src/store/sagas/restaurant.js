/* eslint-disable */

import { takeLatest, takeEvery, all } from "redux-saga/effects";

import api from "~/store/api";
import { setToast } from "~/store/actions/common";
import { saveRestaurants } from "~/store/actions/restaurant";

import { createRequestSaga } from "~/store/sagas/common";

const requestGetOutlets = createRequestSaga({
  request: api.restaurant.getOutlets,
  key: "getRestaurantOutlet",
  success: [data => saveRestaurants(data)],
  failure: [() => setToast("Couldn't get data", "danger")]
});

const requestSearchOutlet = createRequestSaga({
  request: api.restaurant.searchOutlet
});

const requestGetCategories = createRequestSaga({
  request: api.restaurant.getCategories
});

const requestGetProductByCategory = createRequestSaga({
  request: api.restaurant.getProductByCategory
});

const requestGetProductByCategories = createRequestSaga({
  request: api.restaurant.getProductByCategories
});



// root saga reducer
export default [
  // watcher for schedule, define term here
  function* asyncUserFetchWatcher() {
    // use takeLatest instead of take every, so double click in short time will not trigger more fork
    yield all([
      takeLatest("restaurant/getOutlets", requestGetOutlets),
      takeLatest("restaurant/searchOutlet", requestSearchOutlet),
      takeEvery("restaurant/getCategories", requestGetCategories),
      takeLatest("restaurant/getProductByCategory", requestGetProductByCategory),
      takeLatest("restaurant/getProductByCategories", requestGetProductByCategories),
    ]);
  }
];