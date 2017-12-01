import React, { Component } from "react";
import Helmet from "react-helmet";
// import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import { Row, Col, Label, Button } from "reactstrap";

import { connect } from "react-redux";

// redux form
import {
  Field,
  // FieldArray,
  reduxForm
} from "redux-form";

// comonents
// import ProductItem from "~/ui/components/Product/Item";
import MaskedInput from "~/ui/components/MaskedInput";
import OrderItem from "./components/OrderItem";
import EmptyResult from "~/ui/components/EmptyResult";

// import options from "./options";

// store
// import api from "~/store/api";
import * as authSelectors from "~/store/selectors/auth";
import * as orderSelectors from "~/store/selectors/order";
import * as commonActions from "~/store/actions/common";

import "./index.css";

@translate("translations")
@reduxForm({
  form: "OrderHistory",
  // validate,
  destroyOnUnmount: false,
  enableReinitialize: true
})
@connect(
  state => ({
    token: authSelectors.getToken(state),
    orderHistory: orderSelectors.getHistory(state)
  }),
  commonActions
)
export default class extends Component {
  renderMaskedInputField = ({ input, label }) => {
    return (
      <div className="col-md-5 col-sm-12">
        <Label>{label}:</Label>
        <MaskedInput
          className="ml-2 pl-2 float-right"
          mask="1111-11-11 11:11"
          placeholder="Y-m-d H:i"
          {...input}
        />
      </div>
    );
  };

  searchOrder = async ({ from, to }) => {
    const { token, requestor } = this.props;
    const options = {};
    from && (options.from = from + ":00");
    to && (options.to = to + ":00");
    // const ret = await api.order.getOrderHistory(token, options);
    // can store into redux
    return new Promise(resolve => {
      requestor("order/getOrderHistory", token, options, () => resolve(true));
    });
  };

  componentDidMount() {
    const { orderHistory } = this.props;
    // always update
    if (!orderHistory || !orderHistory.length) {
      this.searchOrder({});
    }
  }

  render() {
    const { submitting, handleSubmit, orderHistory, t } = this.props;
    // orderHistory.forEach(c=>{
    //   c.items.forEach((c1, index)=>{
    //     c1.options = {
    //     "total": "summary of all breakdown.total",
    //     "mandatory": "0/1",
    //     "breakdown": [
    //       {
    //         "name": "option" + index,
    //         "price": 100000*(index+1),
    //         "qty": index+1,
    //         "total": 100000*(index+1),
    //       },
    //       {
    //         "name": "option1" + index,
    //         "price": 100000*(index+1),
    //         "qty": index+1,
    //         "total": 100000*(index+1),
    //       }
    //     ]
    //   };

    //   })
    // })
    return (
      <div className="">
        <Helmet>
          <title>{t("LABEL.ORDERS")}</title>
          <meta name="description" content={t("LABEL.ORDERS")} />
        </Helmet>

        <Row className="my-2">
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

          <Col className="d-flex flex-column justify-content-end align-items-md-end mt-2 mt-md-0 col-md-2">
            <Button
              size="sm"
              color="danger"
              disabled={submitting}
              onClick={handleSubmit(this.searchOrder)}
            >
              {t("LABEL.SEARCH")}
            </Button>
          </Col>
        </Row>
        <Row>
          <div className="w-100 customer-order mt-4 d-none d-md-flex">
            <strong className="col-3">
              {t("LABEL.TYPE")}
              {" | "}
              {t("LABEL.STATUS")}
            </strong>

            <strong className="col-4">{t("LABEL.RESTAURANT_NAME")}</strong>

            <strong className="col-2">{t("LABEL.DATE")}</strong>

            <strong className="col">{t("LABEL.AMOUNT")}</strong>
          </div>

          {orderHistory && orderHistory.length ? (
            orderHistory.map(order => (
              <OrderItem
                key={order.order_uuid}
                order={order}
                className="w-100 mb-4 bg-white border color-black-300 table-responsive"
              />
            ))
          ) : (
            <EmptyResult />
          )}
        </Row>
      </div>
    );
  }
}
