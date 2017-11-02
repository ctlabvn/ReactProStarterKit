import React, { Component } from "react";
import { translate } from "react-i18next";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";

// redux form
import { Field, FieldArray, reduxForm } from "redux-form";

// reactstrap
import { Button, Form, FormGroup, Row } from "reactstrap";

import ButtonRound from "~/ui/components/Button/Round";

// store
import * as commonActions from "~/store/actions/common";
import * as authActions from "~/store/actions/auth";
import * as authSelectors from "~/store/selectors/auth";

// components
import { InputField } from "~/ui/components/ReduxForm";

import { validate } from "./utils";

@translate("translations")
@connect(
  state => ({
    initialValues: {
      ...authSelectors.getCustomer(state),
      address: authSelectors.getAddress(state)
    },
    token: authSelectors.getToken(state)
  }),
  { ...commonActions, ...authActions }
)
@reduxForm({
  form: "Profile",
  validate,
  destroyOnUnmount: false,
  enableReinitialize: true
})
export default class extends Component {
  updateCustomer = ({ customer_uuid, name, phone, address }) => {
    const { token, requestor } = this.props;
    requestor(
      "customer/requestUpdateCustomer",
      token,
      customer_uuid,
      name,
      phone
    );
    // update address
    address.forEach(item => {
      const { cus_address_uuid, name, address } = item;
      if (cus_address_uuid) {
        requestor(
          "customer/requestUpdateAddress",
          token,
          cus_address_uuid,
          name,
          address
        );
      } else {
        requestor(
          "customer/requestAddAddress",
          token,
          customer_uuid,
          name,
          address
        );
      }
    });
    return true;
  };

  renderAddress = ({ fields }) => {
    const { t } = this.props;
    return (
      <div className="mt-4 mb-4 ml-5">
        <Button onClick={() => fields.push({})}>
          {t("BUTTON.ADD_ADDRESS")}
        </Button>
        {fields.map((member, index) => (
          <Row key={index} className="mb-4">
            <Field
              className="col mb-0"
              label="Address name"
              name={`${member}.name`}
              component={InputField}
            />
            <Field
              className="col mb-0"
              label="Address"
              name={`${member}.address`}
              component={InputField}
            />
            <ButtonRound
              className="align-self-start"
              icon="remove"
              onClick={() => fields.remove(index)}
            />
          </Row>
        ))}
      </div>
    );
  };

  render() {
    const { handleSubmit, submitting, t } = this.props;
    return (
      <div className="container">
        <h1>Edit Profile</h1>
        <hr />
        <div className="row">
          <div className="col-md-4">
            <div className="text-center">
              <img
                src="//placehold.it/100"
                className="rounded-circle mb-4"
                alt="avatar"
              />
              <input type="file" className="form-control" />
            </div>
          </div>

          <div className="col-md-8 personal-info">
            <h3>Personal info</h3>

            <Form className="form-horizontal">
              <Field
                className="ml-5"
                label="Username"
                name="name"
                component={InputField}
              />

              <Field
                className="ml-5"
                label="Phone"
                name="phone"
                component={InputField}
              />

              <FieldArray name="address" component={this.renderAddress} />

              <FormGroup className="ml-5">
                <Button
                  disabled={submitting}
                  onClick={handleSubmit(this.updateCustomer)}
                  color="primary"
                >
                  {t("BUTTON.UPDATE")}
                </Button>
              </FormGroup>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}