import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import Readmore from "~/ui/components/Restaurant/Readmore";

import { translate } from "react-i18next";

import HeadingDouble from "~/ui/components/Heading/Double";
import ButtonRound from "~/ui/components/Button/Round";
import Image from "~/ui/components/Image";

import "./index.css";

@translate("translations")
export default class extends Component {
  static propTypes = {
    itemUuid: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.number,
    description: PropTypes.string,
    priceUnit: PropTypes.string,
    image: PropTypes.string,
    quantity: PropTypes.number,
    imageSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    displayItem: PropTypes.bool
  };

  static defaultProps = {
    priceUnit: "$",
    imageSize: 50,
    quantity: 1,
    displayItem: true,
  };

  render() {
    const {
      title,
      price,
      priceUnit,
      image,
      imageSize,
      description,
      className,
      itemUuid,
      quantity,
      onIncrease,
      onDecrease,
      t,
	    displayItem
    } = this.props;

    const totalPrice = price * quantity;
    if(displayItem) {
	    return (
        <div
          className={classNames("d-flex flex-row align-items-center", className)}
        >
			    {image && <Image
            style={{ width: imageSize, height: imageSize }}
            src={image}
            alt="..."
            className="rounded-circle"
          />}
          <div className="flex-column d-flex ml-3 w-100">
            <Link to={`/item/${itemUuid}`}>
              <HeadingDouble
                leftTitle={title}
                rightTitle={t("format.currency", {
							    price: totalPrice,
							    symbol: priceUnit
						    })}
              />
            </Link>
            <div className="flex-row d-flex justify-content-between">
              <div className="pr-4">
                <Readmore line="2" more={t('LABEL.SHOW_MORE')} less={t('LABEL.SHOW_LESS')}>
                  <p className="w-100 mt-3 html-content">{description}</p>
                </Readmore>
              </div>
              <div className="d-flex flex-column justify-content-between">
						    {onIncrease && <ButtonRound icon="plus" onClick={onIncrease} />}
						    {/*{quantity > 0 && <ButtonRound icon="minus" onClick={onDecrease} />}*/}
              </div>
            </div>
          </div>
        </div>
	    );
    }

    return '';
  }
}