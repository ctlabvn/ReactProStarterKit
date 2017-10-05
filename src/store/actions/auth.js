// actions creator : called by sagas

/**
 * Sets the authentication state of the application
 * @param  {boolean} newAuthState True means a user is logged in, false means no user is logged in
 */
export const setAuthState = (newAuthState) => ({
  type: 'app/setAuthState',
  payload: newAuthState, 
})


export const saveLoggedUser = (data) => ({
  type: 'app/saveLoggedUser',
  payload: {
    user: data.user,
    token: data.token,    
  }
})

// data: {accessToken...}
export const saveRefreshToken = (data) => ({
  type: 'app/saveRefreshToken',
  payload: data,
})

/**
 * Tells the app we want to log out a user
 */
export const removeLoggedUser = () => ({
  type: 'app/removeLoggedUser',  
})

