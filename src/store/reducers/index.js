import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { reducer as form } from 'redux-form'

import { requests, toast } from './common'
import { authReducer as auth } from './auth'
import { eventReducer as event } from './event'

// a rootReducer is like a single state, key is function return a sub state value
const rootReducer = combineReducers({
	routing,
  form, // for complex reducer, should put at root
  ui: combineReducers({
    toast,
  }),  
  requests,    
  auth,
  event,
})

export default rootReducer

