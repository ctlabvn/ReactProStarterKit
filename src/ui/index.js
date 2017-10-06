import React from 'react'
import { ConnectedRouter } from 'react-router-redux'
import { Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'

import App from './containers/App'

import NotFound from './containers/NotFound'
import Home from './containers/Home'
import Restaurant from './containers/Restaurant'

const Root = ({ store, history }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App>
        <Switch>        
          <Route exact path="/" component={Home} />
          <Route exact path="/restaurant" component={Restaurant} />                  
          <Route component={NotFound} />
        </Switch>
      </App>
    </ConnectedRouter>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default Root