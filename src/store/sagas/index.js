import { fork, all } from "redux-saga/effects";
import { watchRequests } from "./common";
import auth from "./auth";
import restaurant from "./restaurant";
import order from "./order";

// saga must be a function like generator of other functions
const rootSaga = function*() {
  yield fork(watchRequests);
  yield all([
    ...auth.map(watcher => fork(watcher)),
    ...restaurant.map(watcher => fork(watcher)),
    ...order.map(watcher => fork(watcher))
  ]);
};

export default rootSaga;
