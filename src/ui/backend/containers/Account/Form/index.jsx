import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'
import { connect } from 'react-redux'

import { 
  renderTextField,
} from '~/ui/backend/shared/utils'

import ErrorMessage from '~/ui/shared/components/ErrorMessage'

import * as authSelectors from '~/store/selectors/auth'
import { updateAccount } from '~/store/actions/auth'
import { setToast } from '~/store/actions/common'


// higher order function for redux form and connect to store
const validate = (values) => {
  const errors = {}
  !values.password && (errors.password = 'Empty password')  
  if(values.new_password !== values.re_new_password){
    errors.re_new_password = 'Password not matched'
  }
  return errors
}

const mapStateToProps = (state) => ({  
  initialValues: authSelectors.getUser(state),
  token: authSelectors.getToken(state),
})

@connect(mapStateToProps, { updateAccount, setToast })
@reduxForm({ form: 'AuthorForm', validate })
export default class AuthorForm extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  state = {
    errorMessage: null,  
  }

  _handleSubmit = props => {    
    this.props.updateAccount(this.props.token, props)
    // this.context.router.push('/')
  }

  renderErrorMessage() {
    return (this.state.errorMessage &&
      <ErrorMessage message={this.state.errorMessage} />
    )
  }

  render() { 
    const { handleSubmit, submitting } = this.props

    return (
      
      <form className="form" onSubmit={handleSubmit(this._handleSubmit)}>
        <h2 className="legend">Update Account</h2>                            
        <Field label="Mật khẩu cũ" name="password" type='password' component={renderTextField}/>                  
        <Field label="Mật khẩu mới" name="new_password" type='password' component={renderTextField}/>                 
        <Field label="Nhập lại mật khẩu mới" name="re_new_password" type='password' component={renderTextField}/>
         

        {this.renderErrorMessage()}        
        <RaisedButton primary={true} className="mt-20" label='Update' type='submit' disabled={submitting} />
        
      </form>
      

    )
  }

}





