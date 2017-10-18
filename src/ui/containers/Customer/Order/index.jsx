import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import { Row, Col, Label, Button } from "reactstrap";

// redux form
import { Field, FieldArray, reduxForm } from "redux-form";

// comonents
import ProductItem from "~/ui/components/Product/Item";
import MaskedInput from "~/ui/components/MaskedInput";
import options from "./options";

@translate("translations")
@reduxForm({
  form: "OrderHistory",
  // validate,
  destroyOnUnmount: false,
  enableReinitialize: true
})
export default class extends Component {
  renderMaskedInputField = ({ input, label }) => {
    return (
      <Col md="3">
        <Label>{label}</Label>
        <MaskedInput
          className="form-control"
          mask="11/11/1111"
          placeholder="dd/mm/yyyy"
          {...input}
        />
      </Col>
    );
  };

  searchOrder = (data)=>{
    console.log(data);
  };

  render() {
    const {submitting, handleSubmit} = this.props;
    return (
      <div className="container">
        <Row>
          <Field
            label="From date"
            name="from"
            component={this.renderMaskedInputField}
          />
          <Field
            label="To date"
            name="to"
            component={this.renderMaskedInputField}
          />

          <Col className="d-flex col flex-column justify-content-end align-items-start">
            <Button disabled={submitting} onClick={handleSubmit(this.searchOrder)}>Search</Button>
          </Col>
        </Row>

        <Row className="mt-5">
          {options.products.map((item, index) => (
            <ProductItem
              className="col-md-6 float-left pl-0 pr-5 mb-4"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
              key={index}
              price={10}
              title={item}
              image="/images/donut.png"
            />
          ))}
        </Row>
      </div>
    );
  }
}