import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";
import ProductItemPhoto from "~/ui/components/Product/Item/Photo";
import Slider from "~/ui/components/Slider";
import ProductItem from "~/ui/components/Product/Item";
import ButtonRound from "~/ui/components/Button/Round";

import * as commonActions from "~/store/actions/common";

import "./index.css";
import options from "./options";

@connect(null, commonActions)
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
    this.loadData = this.loadData.bind(this);
  }

  loadData() {
    this.props.requestor("restaurant/getOutlets", (err, ret) => {
      this.setState({
        data: ret.data.data
      });
    });
  }

  render() {
    const { data } = this.state;
    return (
      <div className="row block bg-white mb-4">
        <h3 className="font-largest color-black w-100 mb-4">
          <span className="font-weight-bold">ALL PRODUCTS</span> (25)
        </h3>

        <Menu>
          {options.items.map((item, index) => (
            <MenuItem key={index} title={item} />
          ))}
        </Menu>

        <Slider className="mt-2" num={5} move={1}>
            {options.products.map((item, index) => (
              <ProductItemPhoto
                key={index}       
                price={10}
                title={item}
                image="/images/donut-square.png"
              />
            ))}         
        </Slider>

        <div className="w-100 mt-5">
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
        </div>
      </div>
    );
  }
}