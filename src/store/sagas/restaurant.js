import { takeLatest, takeEvery, all } from 'redux-saga/effects'

import api from '~/store/api'
import { setToast } from '~/store/actions/common'


import {     
  createRequestSaga
} from '~/store/sagas/common'


const getOutlet = createRequestSaga({
  request: api.restaurant.getOutlets,
  key: 'getRestaurantOutlet',
  failure: [ 
    () => setToast('Couldn\'t get data', 'error') 
  ],
})



// root saga reducer
export default [
  // watcher for schedule, define term here
  function* asyncUserFetchWatcher() {
    // use takeLatest instead of take every, so double click in short time will not trigger more fork
    yield all([
      takeLatest('restaurant/getOutlets', getOutlet),
    ])
  }
]

