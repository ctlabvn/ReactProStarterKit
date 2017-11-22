import React, { Component } from "react";
import Helmet from "react-helmet";
import { translate } from "react-i18next";
import { Link } from "react-router-dom";
// import { connect } from "react-redux";

// store
// import * as commonActions from "~/store/actions/common";
// import * as restaurantActions from "~/store/actions/restaurant";
// import * as restaurantSelectors from "~/store/selectors/restaurant";
// import * as authSelectors from "~/store/selectors/auth";

// components
import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";
import Suggestion from "~/ui/components/Suggestion";

import api from "~/store/api";

import "./index.css";

@translate("translations")
// @connect(state => ({}), { ...commonActions })
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: []
    };
  }

  async componentWillMount() {
    const ret = await api.setting.getSettingTags();
    this.setState({ tags: ret.data });
  }

  render() {
    const { t } = this.props;
    const { tags } = this.state;
    return (
      <div className="d-flex flex-column align-items-center">
        <Helmet>
          <title>{t("LABEL.HOME")}</title>
          <meta name="description" content={t("LABEL.HOME")} />
        </Helmet>

        <img alt="" src="/images/home-logo.png" />

        <div className="input-group rounded input-group-lg col-md-5 m-5 px-0">
          <Suggestion
            buttonClass="p-0 border-0 "
            inputClass="color-gray-500"
            placeholder={t("PLACEHOLDER.TYPE_YOUR_PRODUCT")}
            className="form-control border-0"
          />
          <span className="input-group-btn" style={{ zIndex: 0 }}>
            <Link className="btn bg-gray-200" to="/restaurant">
              <i className="fa fa-search color-gray-500" aria-hidden="true" />
            </Link>
          </span>
        </div>
        <div className="col-md-5">
          {!!tags.length && (
            <label className="pull-left text-uppercase color-gray">
              {t("LABEL.SUGGESSTION")}:
            </label>
          )}
        </div>
        <Menu className="col-md-5">
          {tags.map(item => (
            <MenuItem
              className="color-black-300 pl-0"
              key={item.tag_uuid}
              link={`/restaurant?tags=${item.tag_uuid}`}
              title={item.name}
            />
          ))}
        </Menu>
      </div>
    );
  }
}
