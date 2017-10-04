import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import LinearProgress from 'material-ui/LinearProgress'

import LoggedNavigationBar from '~/ui/shared/components/NavigationBar/Logged'
import LoginNavigationBar from '~/ui/shared/components/NavigationBar/Index'

import inlineStyles from '~/ui/shared/styles/MaterialUI/index'

import AppNavDrawer from '~/ui/backend/components/AppNavDrawer'
import FullWidthSection from '~/ui/backend/components/FullWidthSection'

import Footer from '~/ui/shared/components/Footer'
import Toasts from '~/ui/shared/components/Toasts'


import * as authSelectors from '~/store/selectors/auth'
import * as commonSelectors from '~/store/selectors/common'
import * as authCreators from '~/store/actions/auth'

// this helps changing one line to modify logic
@connect(state => ({
  loggedIn        : authSelectors.isLogged(state),
  requestsPending : commonSelectors.areRequestsPending(state),
}), authCreators)
export default class extends Component {

  static contextTypes = {
    router: PropTypes.object
  }

  constructor(props) {
    super(props);
  
    this.state = {
      navDrawerOpen: true
    };
  }

  componentWillMount(){
    const { router: { history, route } } = this.context
    if (!this.props.loggedIn) {
      const { location: { pathname } } = route
      history.replace(`/login/?redirect=${pathname}`)
    }
  }


  render(){    
    const {children, loggedIn, requestsPending, logout} = this.props
    const {navDrawerOpen} = this.state
    return (
      <div className="container-fluid p-0">     

        {requestsPending && // if there were some requests pending
          <LinearProgress
            mode="indeterminate"
            min={70} max={75}
            color={inlineStyles.progressColor}
            style={inlineStyles.progressBar}
          />
        }

        {loggedIn // check login
          ? <LoggedNavigationBar onLogout={logout} />
          : <LoginNavigationBar/>
        }

        <AppNavDrawer                                     
          docked={true}                
          open={navDrawerOpen}
        />

        <FullWidthSection>          
            {children}          
        </FullWidthSection>

        <Toasts />
        <Footer/>

      </div>
    )
  }
} 
