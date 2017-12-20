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
    const { t, fields, meta: { error } } = this.props;
    return (
      <div className="my-4">
        {fields.map((member, index) => (
          <Row key={index} className="mb-4 p-2">
            <Field
              className="col mb-0"
              placeholder={t("PLACEHOLDER.NAME")}
              name={`${member}.name`}
              component={InputField}
            />
            <Field
              className="col mb-0"
              placeholder={t("PLACEHOLDER.ADDRESS")}
              name={`${member}.address`}
              component={InputField}
            />
            <ButtonRound
              className="align-self-start btn-danger"
              icon="remove"
              onClick={() => fields.remove(index)}
            />
            {error &&
              error[index] && (
                <span className="color-red col-md-12">{error[index]}</span>
              )}
          </Row>
        ))}
        <ButtonRound
          className="btn-success"
          onClick={e => fields.push({})}
          icon="plus"
        />
      </div>
    );
  }
}
