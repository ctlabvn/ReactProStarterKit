import { takeLatest, takeEvery, all } from "redux-saga/effects";

import api from "~/store/api";
import { setToast } from "~/store/actions/common";
import { updateOrderHistory } from "~/store/actions/order";

import { createRequestSaga } from "~/store/sagas/common";

const createOrder = createRequestSaga({
  request: api.order.createOrder,  
  success: [
    () => setToast("Create order successfully!!!"),
  ]
});

const getOrderHistory = createRequestSaga({
  request: api.order.getOrderHistory,    
  success: [
    ({data}) => updateOrderHistory(data),
  ]
});

// root saga reducer
export default [
  // watcher for schedule, define term here
  function* asyncUserFetchWatcher() {
    // use takeLatest instead of take every, so double click in short time will not trigger more fork
    yield all([
      takeLatest("order/requestCreateOrder", createOrder),
      takeLatest("order/getOrderHistory", getOrderHistory),
    ]);
  }
];