import React, { Component } from "react";

import { translate } from "react-i18next";
import { connect } from "react-redux";

// reactstrap
import {
  Button,
  Form,
  // FormGroup,
  // Label,
  // Input,
  // FormText,
  Row
} from "reactstrap";

// redux form
import { Field, reduxForm } from "redux-form";

// components
import { InputField } from "~/ui/components/ReduxForm";

import * as commonActions from "~/store/actions/common";
import * as orderSelectors from "~/store/selectors/order";

import { validate } from "./utils";

@translate("translations")
@connect(state=>({
  initialValues:{
    address: orderSelectors.getInfo(state).order_address
  }
}), commonActions)
@reduxForm({
  form: "Signup",
  validate,
  destroyOnUnmount: false,
  enableReinitialize: true
})
export default class extends Component {
  signup = ({ name, email, password, address, phone, address_name }) => {
    const { requestor } = this.props;
    
    requestor(
      "app/signup",
      email,
      password,
      // extra fields
      {
        name,
        phone,
        address_name,
        address
      },
      (err, ret) => {
        if (!err) {
          // auto login if success
          requestor("app/login", email, password);
        }
      }
    );
  };

  render() {
    const { t, submitting, handleSubmit } = this.props;
    return (
      <Form>
        <Row>
          <Field
            className="col-md-6"
            label="Name"
            name="name"
            component={InputField}
          />
          <Field
            className="col-md-6"
            label="Phone"
            name="phone"
            component={InputField}
          />
        </Row>
        <Row>
          <Field
            className="col-md-6"
            label="Email"
            name="email"
            component={InputField}
          />

          <Field
            className="col-md-6"
            label="Password"
            name="password"
            type="password"
            component={InputField}
          />
        </Row>

        <Row>
          <Field
            className="col-md-6"
            label="Address name"
            name="address_name"
            component={InputField}
          />

          <Field
            className="col-md-6"
            label="Address"
            name="address"
            component={InputField}
          />
        </Row>

        <Button
          disabled={submitting}
          onClick={handleSubmit(this.signup)}
          color="primary"
        >
          {t("BUTTON.SUBMIT")}
        </Button>
      </Form>
    );
  }
}