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
      address: authSelectors.getAddress(state),      
    },
    token: authSelectors.getToken(state),
  }),
  {...commonActions, ...authActions}
)
@reduxForm({
  form: "Profile",
  validate,
  destroyOnUnmount: false,
  enableReinitialize: true
})
export default class extends Component {

  updateCustomer = ({customer_uuid, name, phone, address})=> {
    const {token, requestor} = this.props;
    requestor('customer/requestUpdateCustomer', token, customer_uuid, name, phone);   
    // update address
    address.map(item=>{
      const {cus_address_uuid, name, address} = item;
      if(cus_address_uuid){
        requestor('customer/requestUpdateAddress', token, cus_address_uuid, name, address);
      } else {
        requestor('customer/requestAddAddress', token, customer_uuid, name, address);
      }
    });    
  };

  renderAddress = ({ fields }) => {
    const { t } = this.props;
    return (
      <Form className="mt-4 mb-4">
        <Button onClick={() => fields.push({})}>{t("BUTTON.ADD_ADDRESS")}</Button>
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
            >{t("BUTTON.REMOVE")}</Button>
          </Row>
        ))}
      </Form>
    );
  };

  render() {
    const { handleSubmit, submitting, t } = this.props;
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
        <Button disabled={submitting} onClick={handleSubmit(this.updateCustomer)} color="primary">{t("BUTTON.UPDATE")}</Button>
      </div>
    );
  }
}