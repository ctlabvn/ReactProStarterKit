import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import classNames from "classnames";

// import { Col } from "reactstrap";

import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";
// import ProductItemPhoto from "~/ui/components/Product/Item/Photo";
// import Slider from "~/ui/components/Slider";
// import ProductGroup from "~/ui/components/Product/Group";
// import ButtonRound from "~/ui/components/Button/Round";
import RestaurantProduct from "~/ui/components/Restaurant/Product";
import EmptyResult from "~/ui/components/EmptyResult";
import AddItemValidator from "~/ui/components/AddItemValidator";
import Spinner from "~/ui/components/Spinner";
// import Image from "~/ui/components/Image";

import Breadcrumb from "./components/Breadcrumb";
import FeaturedProducts from "./components/FeaturedProducts";

import * as commonActions from "~/store/actions/common";
// import * as restaurantValidation from "~/store/utils/validation/restaurant";

// import api from "~/store/api";
import "./index.css";

import { extractMessage, isMobile, checkOrderAvailable } from "~/utils";

@translate("translations")
@connect(null, commonActions)
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: "",
      products: {},
      categories: [],
      isLoadingItem: false
    };
  }

  handleCategory = parentCategory => {
    this.loadProducts(parentCategory);
  };

  loadProducts = async parentCategory => {
    const { requestor, setToast } = this.props;
    const products = {};
    const childCategories = this.treeCategory[parentCategory];

    this.setState({ isLoadingItem: true, products });

    requestor(
      "restaurant/getProductByCategories",
      childCategories,
      (err, ret) => {
        // console.log(err, ret);
        if (err) {
          setToast(extractMessage(err.message), "danger");
        } else if (ret) {
          ret.forEach(item =>
            item.data.data.forEach(product => {
              if (!products[product.category_uuid]) {
                products[product.category_uuid] = [];
              }
              products[product.category_uuid].push(product);
            })
          );

          this.setState({ isLoadingItem: false, products });
        }
      }
    );
  };

  handleSearchKeyUp = ({ target, keyCode }) => {
    const term = target.value.trim();
    if (term !== this.state.term) {
      this.setState({ term });
    }
  };

  handleAddOrderItem = (item, item_options = []) => {
    this.addItemValidator.handleAddOrderItem(item, item_options);
  };

  loadCategories = async outlet_uuid => {
    this.treeCategoryName = {};
    this.treeCategory = {};
    let categories = [];

    const ret = await this.getAllCategories(outlet_uuid);
    if (ret) {
      categories = ret.data;
    }
    console.log(categories);
    // bind data
    this.setState({ categories });
  };

  getAllCategories(outlet_uuid) {
    const { requestor, setToast } = this.props;
    return new Promise((resolve, reject) => {
      requestor("restaurant/getAllCategories", outlet_uuid, (err, ret) => {
        if (err) {
          setToast(extractMessage(err.message), "danger");
          resolve(null);
        } else {
          resolve(ret);
        }
      });
    });
  }

  componentDidMount() {
    const { outlet } = this.props;
    this.loadCategories(outlet.outlet_uuid);
  }

  componentWillReceiveProps({ outlet }) {
    if (this.props.outlet !== outlet) {
      this.loadCategories(outlet.outlet_uuid);
    }
  }

  onSelectBreadcrumb(category_uuid) {
    console.log("--------------- ", category_uuid);
  }

  render() {
    const { t, outlet, outlet_slug } = this.props;
    const { term, products, isLoadingItem, categories } = this.state;
    let categoryHasChildProduct = [];

    const showCategories = [];
    const canAddOrder = checkOrderAvailable(outlet);

    if (outlet.total_items) {
      categories.forEach(item => {
        this.treeCategoryName[item.category_uuid] = item.name;
        if (item.parent_uuid) {
          if (this.treeCategory.hasOwnProperty(item.parent_uuid)) {
            this.treeCategory[item.parent_uuid].push(item.category_uuid);
          } else {
            this.treeCategory[item.parent_uuid] = [
              item.parent_uuid,
              item.category_uuid
            ];
          }
          if (item.total_items !== 0) {
            categoryHasChildProduct.push(item.parent_uuid);
          }
        } else {
          // console.log(item.total_items, categoryHasChildProduct, item.category_uuid);
          if (
            categoryHasChildProduct.indexOf(item.category_uuid) > -1 ||
            item.total_items !== 0
          ) {
            showCategories.push(item);
          }
          if (!this.treeCategory.hasOwnProperty(item.category_uuid)) {
            this.treeCategory[item.category_uuid] = [item.category_uuid];
          }
        }
      });

      return (
        <div className="w-100">
          {/*
           <h5 className="mb-2">
           <strong className="text-uppercase color-black">All products</strong>
           <span className="color-gray font-weight-normal">
           {" "}
           ({outlet.total_items})
           </span>
           </h5>
           */}
          <FeaturedProducts outlet={outlet} outlet_slug={outlet_slug} />

          <div className="row w-100 no-gutters">
            <Menu
              className={classNames("col col-md-2 list-group restaurant-cat", {
                "border-right-0": isMobile
              })}
            >
              {showCategories.map((item, index) => {
                return (
                  <MenuItem
                    className="text-uppercase font-weight-bold pl-0"
                    onClick={() => this.handleCategory(item.category_uuid)}
                    key={item.category_uuid}
                    title={item.name}
                    clickIt={!index}
                  />
                );
              })}
            </Menu>

            <div className="col p-0 restaurant-body-content">
              <div className="row mx-0 restaurant-body-input">
                <Breadcrumb
                  categories={showCategories}
                  onSelected={this.onSelectBreadcrumb}
                />

                <div className="mt-2 mt-md-0 d-md-flex flex-row-reverse form-group col-md-6 pull-right mt-0">
                  <div className="input-group restaurant-body-search">
                    <input
                      className="form-control"
                      placeholder={t("PLACEHOLDER.TYPE_YOUR_SEARCH")}
                      onKeyUp={this.handleSearchKeyUp}
                    />
                    <span className="input-group-addon px-4">
                      <i className="fa fa-search color-red" />
                    </span>
                  </div>
                </div>
              </div>

              {isLoadingItem ? (
                <Spinner />
              ) : (
                <RestaurantProduct
                  outlet_slug={outlet_slug}
                  term={term}
                  className="p-0"
                  products={products}
                  treeCategoryName={this.treeCategoryName}
                  onAddOrder={canAddOrder ? this.handleAddOrderItem : null}
                />
              )}
            </div>
          </div>

          <AddItemValidator
            outlet={outlet}
            onItemRef={ref => (this.addItemValidator = ref)}
          />
        </div>
      );
    }

    return (
      <div className="d-block text-center w-100 py-5">
        <EmptyResult label={t("LABEL.NO_SEARCH_DATA")} />
      </div>
    );
  }
}
