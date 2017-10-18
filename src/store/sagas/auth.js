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


const requestLoginFacebookAsync = createRequestSaga({
  request: api.auth.loginFacebook,
  key: 'loginFacebook',
  cancel: 'app/logout',
  success: [   
    (data) => saveLoggedUser(data),       
    () => setAuthState(true),
    () => setToast('Logged successfully!!!'), 
    // () => forwardTo('/dashboard'),
  ],
  failure: [ 
    () => setToast('Couldn\'t login', 'danger') 
  ],
})


const requestLoginGoogleAsync = createRequestSaga({
  request: api.auth.loginGoogle,
  key: 'loginGoogle',
  cancel: 'app/logout',
  success: [   
    (data) => saveLoggedUser(data),   
    () => setAuthState(true),    
    () => setToast('Logged successfully!!!'), 
    // () => forwardTo('/dashboard'), // action creator may return nothing to match
  ],
  failure: [ 
    () => setToast('Couldn\'t login', 'danger') 
  ],
})

const requestLoginAsync = createRequestSaga({
  request: api.auth.login,
  key: 'login',
  cancel: 'app/logout',
  success: [   
    ({data}) => saveLoggedUser(data),   
    () => setAuthState(true),    
    () => setToast('Logged successfully!!!'), 
    () => forwardTo('/customer/profile'), // action creator may return nothing to match
  ],
  failure: [ 
    () => setToast('Couldn\'t login', 'danger') 
  ],
})


const requestUpdateAccountAsync = createRequestSaga({
  request: api.auth.updateAccount,
  key: 'updateAccount',
  cancel: 'app/updateAccount',
  success: [        
    () => setToast('Update Account successfully!!!'),   
    () => forwardTo('/admin'),  
  ],
  failure: [ 
    () => setToast('Couldn\'t update', 'danger') 
  ],
})


const requestLogoutAsync = createRequestSaga({
  request: api.auth.logout,
  key: 'logout',
  success: [       
    () => removeLoggedUser(),    
    () => setAuthState(false),  
    () => setToast('Logout successfully!!!'),  
    () => forwardTo('/'),
  ],
  failure: [ 
    () => setToast('Couldn\'t logout', 'danger') 
  ],
});

const updateCustomerAsync = createRequestSaga({
  request: api.auth.updateCustomer,
  success: [       
    ({data}) => updateCustomer(data),        
    () => setToast('Update customer successfully!!!'), 
  ],
  failure: [ 
    () => setToast('Couldn\'t update customer', 'danger') 
  ],
})

const updateAddressAsync = createRequestSaga({
  request: api.auth.updateAddress,
  success: [       
    ({data}) => updateAddress(data),            
  ],
})

const addAddressAsync = createRequestSaga({
  request: api.auth.addAddress,
  success: [       
    ({data}) => addAddress(data),            
  ],
})

// root saga reducer
const asyncAuthWatchers = [
  // like case return, this is take => call
  // inner function we use yield*
  // from direct watcher we just yield value
  function* asyncLoginFetchWatcher() {
    // use takeLatest instead of take every, so double click in short time will not trigger more fork
    yield all([      
      takeLatest('app/loginFacebook', requestLoginFacebookAsync),
      takeLatest('app/loginGoogle', requestLoginGoogleAsync),
      takeLatest('app/login', requestLoginAsync),
      takeLatest('app/updateAccount', requestUpdateAccountAsync),

      // customer
      takeLatest('customer/requestUpdateCustomer', updateCustomerAsync),
      takeLatest('customer/requestAddAddress', addAddressAsync),
      takeLatest('customer/requestUpdateAddress', updateAddressAsync),      
    ])
  },

  function* asyncLogoutFetchWatcher() {
    // use takeLatest instead of take every, so double click in short time will not trigger more fork
    yield all([
      takeLatest('app/logout', requestLogoutAsync),      
    ])
  }
]

export default asyncAuthWatchers

