import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import { Form, Button } from "reactstrap";

import { connect } from "react-redux";

// redux form
import { Field, 
  // FieldArray, 
  reduxForm 
} from "redux-form";

// comonents
// import ProductItem from "~/ui/components/Product/Item";
// import EmptyResult from "~/ui/components/EmptyResult";
import { InputField } from "~/ui/components/ReduxForm";
import Login from "~/ui/components/Login";
import {history} from "~/store";

// import options from "./options";

// store
// import api from "~/store/api";
import * as authSelectors from "~/store/selectors/auth";
import * as commonActions from "~/store/actions/common";

import {extractMessage} from "~/ui/utils";
import {validate} from "./utils";

@translate("translations")
@reduxForm({
  form: "PasswordReset",
  validate,
  destroyOnUnmount: false,
  enableReinitialize: true
})
@connect(
  state => ({    
    isLogged: authSelectors.isLogged(state),
  }),
  commonActions
)
export default class extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      showLogin: false
    };    
  }

  // will run because of connect from redux, it will set props via state
  componentWillReceiveProps({isLogged}){
    if(isLogged){
      history.push('/')
    }
  }

  resetPassword = ({email})=>{
    // console.log(email)
    const {requestor, setToast} = this.props;
    requestor('customer/resetPassword', email, (err, ret)=>{          
      if(err){        
        setToast(extractMessage(err.message), 'danger');
      } else {
        setToast('Reset password successfully!', 'success');
        this.setState({showLogin: true});
      }
    })    
  };

  renderResetPassword(){
    const { submitting, handleSubmit } = this.props;
    return(
      <div className="w-50 mt-5">
        <h2>Forgot Your Password?</h2>
        <Form>
          <Field
            label="Your email password"
            name="email"
            component={InputField}
          />
          
            <Button
              block
              color="primary"
              disabled={submitting}
              onClick={handleSubmit(this.resetPassword)}
            >
              Reset password
            </Button>
          
        </Form>        
        </div>
    )
  }
 
  render() {    
    const { showLogin } = this.state;
    return (
      <div className="container d-flex justify-content-center">
        {showLogin ? 
          <div className="w-50 mt-5">
        <h2>Login your account</h2>
          <Login/> 
          </div>
          : this.renderResetPassword() }
      </div>
    );
  }
}