import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import ErrorMessage from '~/ui/shared/components/ErrorMessage'
import { login } from '~/store/actions/auth'
import * as commonSelectors from '~/store/selectors/common'
import * as authSelectors from '~/store/selectors/auth'
import RaisedButton from 'material-ui/RaisedButton'
// import { withRouter } from 'react-router-dom'
import Divider from 'material-ui/Divider'


import { 
  renderTextField, 
  renderCheckbox, 
} from '~/ui/backend/shared/utils'

const validate = (values) => {
  const errors = {}
  // first time it is empty
  if(!values) return errors
  if (!values.username) errors.username = 'Enter username'
  if (!values.password) errors.password = 'Enter password'

  return errors
}

const mapStateToProps = (state) => ({  
  initialValues: {remember: false},
  loginRequest: commonSelectors.getRequest(state, 'login'),
  loggedIn : authSelectors.isLogged(state),
})

// @withRouter
@connect(mapStateToProps, { login })
@reduxForm({ form: 'AuthLoginForm', validate })
export default class AuthorLogin extends Component {

  // or you can use @withRouter
  static contextTypes = {
    router: PropTypes.object
  }

  _handleSubmit = ({username, password, remember}) => {
    this.props.login(username, password, remember)
  }

  componentWillMount() {
    if (this.props.loggedIn) {
      this.context.router.push('/')
    }
  }

  render() {    
    const { handleSubmit, submitting, loginRequest } = this.props
    return (
      <div className="login-box">
        <form className="form" onSubmit={handleSubmit(this._handleSubmit)} >        
          <h2>Mời bạn đăng nhập tài khoản</h2>
          <Divider/>
          <Field name="username" label="Enter username" component={renderTextField} />
          <Field name="password" type='password' label="Enter password" component={renderTextField} />
          <div className="mt-10 m-0 row">
            <div className="pull-left">
              <Field name="remember" label="Remember" component={renderCheckbox} />
            </div>          
            <div className="text-center pull-right">
              {loginRequest.status === 'failure' &&
                <ErrorMessage message={loginRequest.error.message} />
              }        
              <RaisedButton primary={true} label='Đăng nhập' type='submit' disabled={submitting}  />    
            </div>    
          </div>
        </form>
      </div>
    )
  }
}

