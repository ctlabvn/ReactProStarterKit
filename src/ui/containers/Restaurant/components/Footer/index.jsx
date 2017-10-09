import React, { Component } from "react";
import { Link } from "react-router-dom";

// component
import ButtonRound from "~/ui/components/Button/Round";
import CommentRating from "~/ui/components/Comment/Rating";
import LabelRating from "~/ui/components/LabelRating";
import Rating from "~/ui/components/Rating";
import ProductItem from "~/ui/components/Product/Item";
import ProductItemPhoto from "~/ui/components/Product/Item/Photo";
import HeadingDouble from "~/ui/components/Heading/Double";

import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";

export default class extends Component {
  render() {
    const menuData = [
      "DONUTS",
      "ICE CREAMS",
      "COOKIES",
      "ICE DRINKS",
      "SALADS",
      "CHOCOLATE"
    ];

    return (
      <div className="row block bg-white">
        <Menu>{menuData.map(item => <MenuItem title={item} />)}</Menu>

        <Rating score={3} />
        <Rating type="Bar" progress={90} />
        <CommentRating />
        <LabelRating progress={76} />
        <ButtonRound icon="angle-right" />
        <ButtonRound icon="plus" />

        <ProductItem
          title="DONUTS PACK x8"
          price={19}
          image="/images/donut.png"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
        />

        <ProductItemPhoto
          title="DONUTS PACK x8"
          price={19}
          image="/images/donut-square.png"
        />
      </div>
    );
  }
}