import { takeLatest, all } from 'redux-saga/effects'

import api from '~/store/api'
import { createRequestSaga } from '~/store/sagas/common'
import { setToast, forwardTo } from '~/store/actions/common'

import { 
  setAuthState,   
  saveLoggedUser, 
  removeLoggedUser,

  updateCustomer,
  addAddress,
  updateAddress, 
} from '~/store/actions/auth'


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

const requestLogin = createRequestSaga({
  request: api.auth.login,
  key: 'login',
  cancel: 'app/logout',
  success: [   
    ({data}) => saveLoggedUser(data),   
    () => setAuthState(true),    
    () => setToast('Logged successfully!!!'), 
    // () => forwardTo('/customer/profile'), // action creator may return nothing to match
  ],
  failure: [ 
    () => setToast('Couldn\'t login', 'danger') 
  ],
})


const requestSignup = createRequestSaga({
  request: api.auth.signup,
  key: 'signup',
  cancel: 'app/login',
  success: [        
    () => setToast('Create Account successfully!!!'),       
  ],
  failure: [ 
    () => setToast('Couldn\'t create account', 'danger') 
  ],
})


const requestLogout = createRequestSaga({
  request: api.auth.logout,
  key: 'logout',
  success: [           
    () => setToast('Logout successfully!!!'),      
  ],
  failure: [ 
    () => setToast('Couldn\'t logout', 'danger') 
  ],
  stop: [
    () => removeLoggedUser(),    
    () => setAuthState(false),  
    () => forwardTo('/'),
  ]
});

const requestUpdateCustomer = createRequestSaga({
  request: api.auth.updateCustomer,
  success: [       
    ({data}) => updateCustomer(data),        
    () => setToast('Update customer successfully!!!'), 
  ],
  failure: [ 
    () => setToast('Couldn\'t update customer', 'danger') 
  ],
})

const requestUpdateAddress = createRequestSaga({
  request: api.auth.updateAddress,
  success: [       
    ({data}) => updateAddress(data),            
  ],
})

const requestAddAddress = createRequestSaga({
  request: api.auth.addAddress,
  success: [       
    ({data}) => addAddress(data),            
  ],
});

const requestResetPassword = createRequestSaga({
  request: api.auth.resetPassword,
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
      takeLatest('app/login', requestLogin),
      takeLatest('app/signup', requestSignup),

      // customer
      takeLatest('customer/requestUpdateCustomer', requestUpdateCustomer),
      takeLatest('customer/requestAddAddress', requestAddAddress),
      takeLatest('customer/requestUpdateAddress', requestUpdateAddress),      

      takeLatest('customer/resetPassword', requestResetPassword),
    ])
  },

  function* asyncLogoutFetchWatcher() {
    // use takeLatest instead of take every, so double click in short time will not trigger more fork
    yield all([
      takeLatest('app/logout', requestLogout),      
    ])
  }
]

export default asyncAuthWatchers

