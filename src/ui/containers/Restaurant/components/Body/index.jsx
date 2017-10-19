import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import { connect } from "react-redux";

import { Col } from "reactstrap";

import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";
import ProductItemPhoto from "~/ui/components/Product/Item/Photo";
import Slider from "~/ui/components/Slider";
import ProductGroup from "~/ui/components/Product/Group";
import ButtonRound from "~/ui/components/Button/Round";

import * as orderActions from "~/store/actions/order";

import api from "~/store/api";
import "./index.css";
import options from "./options";

@translate('translations')
@connect(null, orderActions)
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
	    products: [],
	    features: [],
    };
  }

  handleCategory = async childCategories => {
	  const metadata = {};
    for(var currentCategoryUuid of childCategories) {
		  await api.restaurant.getProductByCategory(currentCategoryUuid).then(ret => {
			  metadata[currentCategoryUuid] = ret.data.data;
		  }, err => console.log(err));
    }
    this.setState({products : metadata});
  };

  render() {
    const { t, outlet } = this.props;
    const { products, features } = this.state;
    const treeCategory = {};
    const treeCategoryName = {};
	  outlet.categories.map(item => {
		  treeCategoryName[item.category_uuid] = item.name;
		  if(item.parent_uuid) {
        if(treeCategory.hasOwnProperty(item.parent_uuid)) {
          treeCategory[item.parent_uuid].push(item.category_uuid);
        } else {
	        treeCategory[item.parent_uuid] = [item.category_uuid];
        }
      } else {
		    if(!treeCategory.hasOwnProperty(item.category_uuid)) {
			    treeCategory[item.category_uuid] = [];
        }
      }
    });
    
    return (
      <div className="row block bg-white mb-4 tab-content">
        <h3 className="font-largest color-black w-100 mb-4">
          <span className="font-weight-bold">{t('LABEL.ALL_PRODUCTS')}</span> ({outlet.total_items})
        </h3>

        <Slider className="mt-2" num={5} move={1}>
	        {features.length ? features.map((item, index) => (
            <ProductItemPhoto
              key={index}
              price={10}
              title={item.name}
              image="/images/donut-square.png"
            />
          )) : ''}
        </Slider>

        <div className="mt-5 row w-100">
          <Menu className="col col-md-2 list-group restaurant-cat">
            {outlet.categories.map(item => {
              if(!item.parent_uuid) {
	              return (
                  <MenuItem
                    onClick={() => this.handleCategory(treeCategory[item.category_uuid])}
                    key={item.category_uuid}
                    title={item.name}
                  />
                );
              }
            })}
          </Menu>

          <Col md="10">
            {Object.keys(products).length ? (
	            Object.keys(products).map((item, index) => (
                <ProductGroup
                  className="col-md-6 float-left pl-0 pr-5 mb-4"
                  name={treeCategoryName[item]}
                  key={index}
                  products={products[item]}
                />
                )
	            )
            ) : (
              <div className="text-center p-2">
                <img src="/images/no-data.png" height="100" alt="" />
                <p className="color-gray text-uppercase">
                  {t("LABEL.CHOOSE_CATEGORY")}
                </p>
              </div>
            )}
          </Col>
        </div>

      </div>
    );
  }
}
