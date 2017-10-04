import React from 'react'
import { ConnectedRouter } from 'react-router-redux'
import { Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import myTheme from '~/ui/shared/theme'

import NotFound from './shared/containers/NotFound'
import App from './shared/containers/App'

import LoginPage from './backend/containers/Account/Login'
import HomeBackend from './backend/containers/Home'
import AccountForm from './backend/containers/Account/Form'
import HomePage from './frontend/containers/Home/Index'

const muiTheme = getMuiTheme(myTheme)

const Root = ({ store, history }) => (
  <Provider store={store}>    
    <MuiThemeProvider muiTheme={muiTheme}>
      <ConnectedRouter history={history}>
        <Switch>       
          <Route exact path="/" component={HomePage} />
          <Route path='/login' component={LoginPage} />                  
          <App>
            <Route exact path="/admin" component={HomeBackend} />  
            <Route path="/admin/account/edit" component={AccountForm} />                        
          </App>
          <Route path="*" component={NotFound} />
        </Switch>     
      </ConnectedRouter>   
    </MuiThemeProvider> 
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default Root