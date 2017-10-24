import React, { Component } from "react";
import { translate } from "react-i18next";

@translate("translations")
export default class EmptyResult extends Component {
  render() {
    const { t } = this.props;
    return (
      <div className="d-flex flex-column w-100 justify-content-center align-items-center p-5">
        <img src="/images/no-data.png" height="100" alt="" />
        <p className="color-gray text-uppercase">{t("LABEL.RESULT_EMPTY")}</p>
      </div>
    );
  }
}