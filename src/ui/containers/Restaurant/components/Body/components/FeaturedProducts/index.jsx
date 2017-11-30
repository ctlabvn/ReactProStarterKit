import React, { Component } from "react";
import { Link } from "react-router-dom";
// import { translate } from "react-i18next";
import { connect } from "react-redux";
// import classNames from "classnames";

// import { Col } from "reactstrap";

import ProductItemPhoto from "~/ui/components/Product/Item/Photo";
import Slider from "~/ui/components/Slider";
import * as commonActions from "~/store/actions/common";

@connect(null, commonActions)
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      features: []
    };
  }

  componentDidMount() {
    this.loadProductFeatured();
  }

  loadProductFeatured() {
    const { requestor, outlet } = this.props;

    requestor(
      "restaurant/getProductFeatured",
      outlet.outlet_uuid,
      (err, ret) => {
        if (!err) {
          this.setState({ features: ret.data.data });
        }
      }
    );
  }

  render() {
    const { outlet_slug } = this.props;
    const { features } = this.state;
    if (!features.length) return null;
    return (
      <div className="mb-4">
        <Slider className="mt-2" num={5} move={1}>
          {features.map((item, index) => (
            <Link
              to={`/${outlet_slug}/${item.slug || item.item_uuid}`}
              key={index}
            >
              <ProductItemPhoto
                className="color-gray font-medium text-uppercase font-weight-bold"
                priceUnit={item.currency.symbol}
                price={item.default_price}
                title={item.name}
                image={
                  item.gallery
                    ? JSON.parse(item.gallery)[0]
                    : "/images/donut-square.png"
                }
              />
            </Link>
          ))}
        </Slider>
        <hr />
      </div>
    );
  }
}
