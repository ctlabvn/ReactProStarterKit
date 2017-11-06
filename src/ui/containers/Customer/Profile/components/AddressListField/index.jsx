import React, { Component } from "react";
import { translate } from "react-i18next";

// redux form
import { Field } from "redux-form";

// reactstrap
import {
  Row
  // DropdownItem
} from "reactstrap";

import { InputField } from "~/ui/components/ReduxForm";
import ButtonRound from "~/ui/components/Button/Round";

@translate("translations")
export default class AdressListField extends Component {
  render() {
    const { t, fields } = this.props;
    return (
      <div className="mt-4 mb-4">
        {fields.map((member, index) => (
          <Row key={index} className="mb-4">
            <Field
              className="col mb-0"
              placeholder={t("Name")}
              name={`${member}.name`}
              component={InputField}
            />
            <Field
              className="col mb-0"
              placeholder="Address"
              name={`${member}.address`}
              component={InputField}
            />
            <ButtonRound
              className="align-self-start btn-danger"
              icon="remove"
              onClick={() => fields.remove(index)}
            />
          </Row>
        ))}
        <ButtonRound
          className="btn-success"
          onClick={e =>fields.push({})}          
          icon="plus"
        />
      </div>
    );
  }
}