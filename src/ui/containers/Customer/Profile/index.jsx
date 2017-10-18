import React, { Component } from "react";
import { translate } from "react-i18next";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

// redux form
import { Field, FieldArray, reduxForm } from "redux-form";

// reactstrap
import { Button, Form, FormGroup, Row } from "reactstrap";

// store
import * as commonActions from "~/store/actions/common";
import * as authSelectors from "~/store/selectors/auth";

// components
import { InputField } from "~/ui/components/ReduxForm";

import { validate } from "./utils";

@translate("translations")
@connect(
  state => ({
    initialValues: {
      ...authSelectors.getCustomer(state),
      address: authSelectors.getAddress(state),      
    },
    token: authSelectors.getToken(state),
  }),
  commonActions
)
@reduxForm({
  form: "Profile",
  validate,
  destroyOnUnmount: false,
  enableReinitialize: true
})
export default class extends Component {

  updateCustomer = (data)=> {
    // console.log(data, this.props.token);
    this.props.setToast("hello every body it is hard to tell it is hard to tell", "danger");
  };

  renderAddress = ({ fields }) => {
    return (
      <Form className="mt-4 mb-4">
        <Button onClick={() => fields.push({})}>Add address</Button>
        {fields.map((member, index) => (
          <Row key={index}>
            <Field
              className="col mb-0 align-self-end"
              label="Address name"
              name={`${member}.name`}
              component={InputField}
            />
            <Field
              className="col mb-0 align-self-end"
              label="Address"
              name={`${member}.address`}
              component={InputField}
            />
            <Button        
              className="align-self-end"                            
              onClick={() => fields.remove(index)}
            >Remove</Button>
          </Row>
        ))}
      </Form>
    );
  };

  render() {
    const { handleSubmit, submitting } = this.props;
    return (
      <div className="container">
        <Form>
          <Row>
            <Field
              className="col"
              label="Name"
              name="name"
              component={InputField}
            />
            <Field
              className="col"
              label="Phone"
              name="phone"
              component={InputField}
            />
          </Row>                    
        </Form>
        <FieldArray name="address" component={this.renderAddress} />
        <Button disabled={submitting} onClick={handleSubmit(this.updateCustomer)} color="primary">Update</Button>
      </div>
    );
  }
}