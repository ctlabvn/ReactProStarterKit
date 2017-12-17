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
import { InputField2, SelectField2 } from "~/ui/components/ReduxForm";

import * as commonActions from "~/store/actions/common";
import * as orderSelectors from "~/store/selectors/order";
import { extractMessage, countries } from "~/utils";

import { validate } from "./utils";

@translate("translations")
@connect(
  state => ({
    initialValues: {
      address: orderSelectors.getInfo(state).order_address,
      country_code: 84 // Viet Nam
    }
  }),
  commonActions
)
@reduxForm({
  form: "Signup",
  validate,
  destroyOnUnmount: false,
  enableReinitialize: true
})
export default class extends Component {
  signup = ({
    name,
    email,
    password,
    address,
    phone,
    address_name,
    country_code
  }) => {
    const { requestor, setToast } = this.props;
    return new Promise(resolve => {
      requestor(
        "app/signup",
        email,
        password,
        country_code,
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
            resolve(true);
            requestor("app/login", email, password);
          } else {
            setToast(extractMessage(err.message), "danger");
            resolve(false);
          }
        }
      );
    });
  };

  render() {
    const { t, submitting, handleSubmit } = this.props;
    return (
      <div className="login">
        <div className="color-red font-fb-120 text-uppercase text-left">or enter your details</div>
        <Field
          className="mt-2 mb-0"
          label="Email"
          name="email"
          component={InputField2}
        />

        <Field
          className="mt-2 mb-0"
          label="Password"
          name="password"
          type="password"
          component={InputField2}
        />

        <Field
          className="mt-2 mb-0"
          label="Name"
          name="name"
          component={InputField2}
        />

        <Field
          className="mt-2 mb-0"
          label="Phone"
          name="phone"
          component={InputField2}
        />

        <Field className="mt-2 mb-0" label="Country Code" name="country_code" component={SelectField2}>
          {countries.map((country, index) => (
            <option key={index} value={country.country_code}>
              {country.name}
            </option>
          ))}
        </Field>

        <div className="text-center mt-2">
          <Button
            disabled={submitting}
            onClick={handleSubmit(this.signup)}
          >
            {t("BUTTON.CONTINUE")}
          </Button>
        </div>
      </div>
      //<Form>
      //  <Row>
      //    <Field
      //      className="col-md-6"
      //      label="Name"
      //      name="name"
      //      component={InputField}
      //    />
      //    <Field
      //      className="col-md-6"
      //      label="Phone"
      //      name="phone"
      //      component={InputField}
      //    />
      //  </Row>
      //  <Row>
      //    <Field
      //      className="col-md-6"
      //      label="Email"
      //      name="email"
      //      component={InputField}
      //    />
      //
      //    <Field
      //      className="col-md-6"
      //      label="Password"
      //      name="password"
      //      type="password"
      //      component={InputField}
      //    />
      //  </Row>
      //
      //  <Row>
      //    <Field
      //      className="col-md-6"
      //      label="Address name"
      //      name="address_name"
      //      component={InputField}
      //    />
      //
      //    <Field
      //      className="col-md-6"
      //      label="Address"
      //      name="address"
      //      component={InputField}
      //    />
      //  </Row>
      //
      //  <Field label="Country Code" name="country_code" component={SelectField}>
      //    {countries.map((country, index) => (
      //      <option key={index} value={country.country_code}>
      //        {country.name}
      //      </option>
      //    ))}
      //  </Field>
      //
      //  <Button
      //    disabled={submitting}
      //    onClick={handleSubmit(this.signup)}
      //    color="danger"
      //  >
      //    {t("BUTTON.SUBMIT")}
      //  </Button>
      //</Form>
    );
  }
}
