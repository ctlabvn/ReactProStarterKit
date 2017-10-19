import React, { Component } from "react";

import { translate } from "react-i18next";
import { connect } from "react-redux";

// reactstrap
import { Button, Form, FormGroup, Label, Input, FormText, Row } from "reactstrap";

// redux form
import { Field, FieldArray, reduxForm } from "redux-form";

// components
import { InputField } from "~/ui/components/ReduxForm";


import * as commonActions from "~/store/actions/common";

import { validateLogin } from "~/ui/utils";


@translate("translations")
@connect(null, commonActions)
@reduxForm({ form: "Login", validate: validateLogin, destroyOnUnmount: false })
export default class extends Component {

  login = ({ email, password }) => {
    this.props.requestor("app/login", email, password, (err, ret) => {      
      this.props.reset();
    });
  };

  render() {
    const {t, handleSubmit, submitting} = this.props;
    return (
      <Form>
        <Row>
          <Field
            className="col"
            label="Email"
            name="email"
            component={InputField}
          />

          <Field
            className="col"
            label="Password"
            name="password"
            type="password"
            component={InputField}
          />
        </Row>

        <Button disabled={submitting} onClick={handleSubmit(this.login)} color="info">{t("BUTTON.LOGIN")}</Button>
      </Form>
    );
  }
}