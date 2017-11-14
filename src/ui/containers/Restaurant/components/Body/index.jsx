import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import classNames from "classnames";

// import { Col } from "reactstrap";

import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";
import ProductItemPhoto from "~/ui/components/Product/Item/Photo";
import Slider from "~/ui/components/Slider";
// import ProductGroup from "~/ui/components/Product/Group";
// import ButtonRound from "~/ui/components/Button/Round";
import RestaurantProduct from "~/ui/components/Restaurant/Product";
import EmptyResult from "~/ui/components/EmptyResult";
// import Image from "~/ui/components/Image";

import * as commonActions from "~/store/actions/common";
import * as orderActions from "~/store/actions/order";
import * as orderSelectors from "~/store/selectors/order";
// import * as restaurantValidation from "~/store/utils/validation/restaurant";

// import api from "~/store/api";
import "./index.css";

import { checkOrderAvailable } from "~/store/utils/validation/restaurant";

import { extractMessage } from "~/ui/utils";

@translate("translations")
@connect(
  state => ({
    orderItems: orderSelectors.getItems(state),
    orderInfo: orderSelectors.getInfo(state)
  }),
  { ...commonActions, ...orderActions }
)
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: {},
      features: [],
      categories: [],
      isLoadingItem: false,
      treeCategory: {},
      treeCategoryName: {}
    };
  }

  handleCategory = parentCategory => {
    this.loadProducts(parentCategory);
  };

  loadProducts = async parentCategory => {
    const { requestor, setToast } = this.props;
    const { treeCategory } = this.state;
    const products = {};
    const childCategories = treeCategory[parentCategory];

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

  showLoading = () => (
    <div className="col text-center py-2">
      <i className="fa fa-refresh fa-spin fa-3x fa-fw" />
    </div>
  );

  handleAddOrderItem = (item, item_options = []) => {
    const {
      orderInfo,
      orderItems,
      outlet,
      clearItems,
      updateOrder,
      addOrderItem
    } = this.props;
    if (orderInfo.outlet_uuid !== outlet.outlet_uuid) {
      // first time or reset
      if (orderItems.length) {
        if (
          !orderInfo.outlet_uuid ||
          window.confirm("Do you want to clear current orders?")
        ) {
          clearItems();
        } else {
          return;
        }
      } else {
        // just clear because it is empty
        clearItems();
      }
    }

    const { default_price, item_uuid, currency, name, description } = item;

    // each time add order, we should update business info for sure
    updateOrder({
      ...outlet.online_order_setting,
      restaurant_address: outlet.address,
      restaurant_lat: outlet.lat,
      restaurant_long: outlet.long
    });
    addOrderItem({
      item_uuid,
      item_options,
      price: default_price,
      quantity: 1,
      name,
      description,
      currency_symbol: currency.symbol
    });
  };

  getCategories(outlet_uuid, page) {
    const { requestor, setToast } = this.props;
    return new Promise((resolve, reject) => {
      requestor("restaurant/getCategories", outlet_uuid, page, (err, ret) => {
        if (err) {
          setToast(extractMessage(err.message), "danger");
          resolve(null);
        } else {
          resolve(ret);
        }
      });
    });
  }

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

  loadCategories = async () => {
    let categories = [];
    const { outlet } = this.props;
    // let hasMore = true,
    //   page = 1;

    // while (hasMore) {
    //   const retOutletCaterogies = await this.getCategories(
    //     outlet.outlet_uuid,
    //     page
    //   );
    //   hasMore =
    //     retOutletCaterogies &&
    //     retOutletCaterogies.data.last_page >
    //       retOutletCaterogies.data.current_page;
    //   // update gradually
    //   if (retOutletCaterogies && retOutletCaterogies.data) {
    //     categories = categories.concat(retOutletCaterogies.data.data);
    //     page++;
    //   }
    // }

    const ret = await this.getAllCategories(outlet.outlet_uuid);
    if(ret){
      categories = ret.data;
    }
    // console.log(categories)
    // bind data
    this.setState({ categories });
  };

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

  renderFeatured(features) {
    if (!features.length) return null;

    return (
      <div className="mb-4">
        <Slider className="mt-2" num={5} move={1}>
          {features.map((item, index) => (
            <Link to={`/item/${item.item_uuid}`} key={index}>
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

  componentDidMount() {
    this.loadCategories();
    this.loadProductFeatured();
  }

  render() {
    const { t, outlet, toggleClass } = this.props;
    const {
      products,
      features,
      isLoadingItem,
      treeCategory,
      treeCategoryName,
      categories
    } = this.state;
    let categoryHasChildProduct = [];

    const showCategories = [];
    const canAddOrder = checkOrderAvailable(outlet);

    if (outlet.total_items) {
      categories.forEach(item => {
        treeCategoryName[item.category_uuid] = item.name;
        if (item.parent_uuid) {
          if (treeCategory.hasOwnProperty(item.parent_uuid)) {
            treeCategory[item.parent_uuid].push(item.category_uuid);
          } else {
            treeCategory[item.parent_uuid] = [
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
            categoryHasChildProduct.indexOf(item.category_uuid) > -1 
            || item.total_items !== 0
          ) {
            showCategories.push(item);
          }
          if (!treeCategory.hasOwnProperty(item.category_uuid)) {
            treeCategory[item.category_uuid] = [item.category_uuid];
          }
        }
      });

      return (
        <div
          className={classNames("row block box-shadow bg-white mb-4 mt-5", toggleClass)}
          id="restaurant-body"
        >
          <h5 className="mb-2">
            <strong className="text-uppercase color-black">All products</strong>
            <span className="color-gray font-weight-normal">
              {" "}
              ({outlet.total_items})
            </span>
          </h5>

          {this.renderFeatured(features)}

          <div className="mt-3 row w-100">
            <Menu className="col col-md-2 list-group restaurant-cat">
              {showCategories.map((item, index) => {
                return (
                  <MenuItem
                    className="text-uppercase font-weight-bold"
                    onClick={() => this.handleCategory(item.category_uuid)}
                    key={item.category_uuid}
                    title={item.name}
                    clickIt={!index}
                  />
                );
              })}
            </Menu>

            {isLoadingItem ? (
              this.showLoading()
            ) : (
              <RestaurantProduct
                products={products}
                treeCategoryName={treeCategoryName}
                onAddOrder={canAddOrder ? this.handleAddOrderItem : null}
              />
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        className={classNames("row block box-shadow bg-white mb-4 mt-5", toggleClass)}
        id="restaurant-body"
      >
        <div className="d-block text-center w-100 py-5">
          <EmptyResult label={t("LABEL.NO_SEARCH_DATA")} />
        </div>
      </div>
    );
  }
}