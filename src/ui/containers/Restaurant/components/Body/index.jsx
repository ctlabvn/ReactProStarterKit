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
	    products: {},
	    features: [],
	    isLoadingItem: false,
	    treeCategory: {},
	    treeCategoryName: {}
    };
  }

	handleCategory = async childCategories => {
		this.setState({isLoadingItem : true, products: {}});
		const lastChildCategory = childCategories[childCategories.length - 1];
		for(const currentCategoryUuid of childCategories) {
			api.restaurant.getProductByCategory(currentCategoryUuid).then(ret => {
				this.setState((prevState) => {
					let products = prevState.products
					if(ret.data.data) {
						products[currentCategoryUuid] = ret.data.data
					}
					return {products: products}
				});
				this.setState({isLoadingItem : false});
			}, err => console.log(err));
		}
	};

	showLoading = () => (
		<div className="col text-center py-2">
			<i className="fa fa-refresh fa-spin fa-3x fa-fw"></i>
		</div>
	)

  render() {
    const { t, outlet } = this.props;
    const { products, features, isLoadingItem, treeCategory, treeCategoryName } = this.state;

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
			    treeCategory[item.category_uuid] = [item.category_uuid ];
        }
      }
    });

	  const firstCategory = Object.keys(treeCategory)[0] ? Object.keys(treeCategory)[0] : '';
    
    return (
      <div className="row block bg-white mb-4 tab-content">
	      {features.length ?
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
		      : ''
	      }

        <div className="mt-3 row w-100">
          <Menu className="col col-md-2 list-group restaurant-cat">
            {outlet.categories.map(item => {
              if(!item.parent_uuid) {
	              return (
                  <MenuItem
                    onClick={() => this.handleCategory(treeCategory[item.category_uuid])}
                    key={item.category_uuid}
                    title={item.name}
                    clickIt={item.category_uuid === firstCategory}
                  />
                );
              }
            })}
          </Menu>

	        {!isLoadingItem ? (
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
	        ) : this.showLoading()
	        }
        </div>

      </div>
    );
  }
}
