import React, { Component } from "react";
import { translate } from "react-i18next";
import Helmet from "react-helmet";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
// redux form
import { Field, FieldArray, reduxForm, SubmissionError } from "redux-form";

// reactstrap
import {
  Button
  // Form,
  // FormGroup
  // Row,
  // ListGroup,
  // ListGroupItem
} from "reactstrap";

// import ButtonRound from "~/ui/components/Button/Round";

// store
import * as commonActions from "~/store/actions/common";
import * as authActions from "~/store/actions/auth";
import * as authSelectors from "~/store/selectors/auth";

// components
import { InputField, SelectField } from "~/ui/components/ReduxForm";
import AddressListField from "./components/AddressListField";
import { validate } from "./utils";

import { countries, extractMessage } from "~/utils";

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
  updateCustomer = ({ customer_uuid, name, phone, address, country_code }) => {
    const { token, requestor, setToast } = this.props;

    // if we use Promise, we can use resolve and reject error instead of throw new error to stop
    // because Promise have to wait for reject
    return new Promise((resolve, reject) => {
      requestor(
        "customer/requestUpdateCustomer",
        token,
        customer_uuid,
        name,
        phone,
        address,
        country_code,
        async (err, ret) => {
          // for item has been delete before :D
          // deleteAddress(cus_address_uuid);
          if (!err) {
            const errors = await this.updateAddresses(customer_uuid, address);
            if (errors.length) {
              reject(new SubmissionError({ address: { _error: errors } }));
            } else {
              setToast("Update customer successfully!!!");
              resolve(true);
            }
          } else {
            setToast(extractMessage(err.message), "danger");
            resolve(false);
          }
        }
      );
    });
  };

  updateAddresses(customer_uuid, address, callback) {
    const {
      initialValues,
      token,
      requestor,
      deleteAddress,
      setToast
    } = this.props;
    const deletedAddress = initialValues.address.filter(item =>
      address.every(
        oldItem => oldItem.cus_address_uuid !== item.cus_address_uuid
      )
    );

    // delete old ones
    deletedAddress.forEach(({ cus_address_uuid }) => {
      requestor(
        "customer/requestDeleteAddress",
        token,
        cus_address_uuid,
        (err, ret) => {
          // for item has been delete before :D
          // deleteAddress(cus_address_uuid);
          if (!err) {
            deleteAddress(cus_address_uuid);
          } else {
            setToast(extractMessage(err.message), "danger");
          }
        }
      );
    });

    // update address
    return Promise.all(
      address.map(
        ({ cus_address_uuid, name, address }, index) =>
          new Promise(resolve => {
            if (cus_address_uuid) {
              requestor(
                "customer/requestUpdateAddress",
                token,
                cus_address_uuid,
                name,
                address,
                (err, ret) => {
                  // for item has been delete before :D
                  // deleteAddress(cus_address_uuid);
                  if (err) {
                    resolve(extractMessage(err.message));
                  } else {
                    resolve(undefined);
                  }
                }
              );
            } else {
              requestor(
                "customer/requestAddAddress",
                token,
                customer_uuid,
                name,
                address,
                (err, ret) => {
                  // for item has been delete before :D
                  // deleteAddress(cus_address_uuid);
                  if (err) {
                    resolve(extractMessage(err.message));
                  } else {
                    resolve(undefined);
                  }
                }
              );
            }
          })
      )
    );
  }

  render() {
    const { handleSubmit, submitting, t } = this.props;
    return (
      <div className="personal-info pl-md-5 my-md-0 my-4">
        <Helmet>
          <title>{t("LABEL.PERSONAL_INFO")}</title>
          <meta name="description" content={t("LABEL.PERSONAL_INFO")} />
        </Helmet>

        <h3>{t("LABEL.PERSONAL_INFO")}</h3>

        <Field label="Fullname" name="name" component={InputField} />

        <Field label="Phone" name="phone" component={InputField} />

        <Field label="Country Code" name="country_code" component={SelectField}>
          {countries.map((country, index) => (
            <option key={index} value={country.country_code}>
              {country.name}
            </option>
          ))}
        </Field>

        <hr />

        <h3>{t("LABEL.MY_ADDRESS")}</h3>
        <FieldArray name="address" component={AddressListField} />

        <hr />

        <Button
          disabled={submitting}
          onClick={handleSubmit(this.updateCustomer)}
          color="danger"
        >
          {t("BUTTON.UPDATE")}
        </Button>
      </div>
    );
  }
}
