import React, { Component } from "react";
import { translate } from "react-i18next";
import Helmet from "react-helmet";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { countries } from "country-data";
// redux form
import { Field, FieldArray, reduxForm } from "redux-form";

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
    const {
      token,
      requestor
      initialValues, deleteAddress
    } = this.props;
    const deletedAddress = initialValues.address.filter(item =>
      address.every(
        oldItem => oldItem.cus_address_uuid !== item.cus_address_uuid
      )
    );

    return new Promise(resolve => {
      requestor(
        "customer/requestUpdateCustomer",
        token,
        customer_uuid,
        name,
        phone,
        address,
        country_code,
        () => resolve(true)
      );
      // update address
      address.forEach(({ cus_address_uuid, name, address }) => {
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
            }
          }
        );
      });
    });
  };

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
          {countries.all.map(country => (
            <option value={country.countryCallingCodes}>{country.name}</option>
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
