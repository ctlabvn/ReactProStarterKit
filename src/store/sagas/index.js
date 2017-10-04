import { fork, all } from 'redux-saga/effects'

import asyncAuth from './auth'
import asyncUser from './user'

// saga must be a function like generator of other functions
const rootSaga = function* () {
  yield all([       
    ...asyncAuth.map(watcher => fork(watcher)),    
    ...asyncUser.map(watcher => fork(watcher)),
  ])
}

export default rootSaga