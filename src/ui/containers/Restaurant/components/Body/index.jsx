import React, { Component } from "react";
// import { Link } from "react-router-dom";
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
import Image from "~/ui/components/Image";

import * as orderActions from "~/store/actions/order";
import * as orderSelectors from "~/store/selectors/order";
// import * as restaurantValidation from "~/store/utils/validation/restaurant";

import api from "~/store/api";
import "./index.css";

import { checkOrderAvailable } from "~/store/utils/validation/restaurant";

@translate("translations")
@connect(
  state => ({
    orderInfo: orderSelectors.getInfo(state)
  }),
  orderActions
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

    this.canAddOrder = checkOrderAvailable(props.outlet);
  }

  handleCategory = parentCategory => {
    this.loadProducts(parentCategory);
  };

  loadProducts = async parentCategory => {
    const { treeCategory } = this.state;
    const childCategories = treeCategory[parentCategory];

    this.setState({ isLoadingItem: true, products: {} });

    for (const currentCategoryUuid of childCategories) {
      api.restaurant.getProductByCategory(currentCategoryUuid).then(
        ret => {
          this.setState(prevState => {
            let products = prevState.products;
            if (ret.data.data) {
              products[currentCategoryUuid] = ret.data.data;
            }
            return { products: products };
          });
          this.setState({ isLoadingItem: false });
        },
        err => console.log(err)
      );
    }
  };

  showLoading = () => (
    <div className="col text-center py-2">
      <i className="fa fa-refresh fa-spin fa-3x fa-fw" />
    </div>
  );

  addOrderItem = item => {
    const {
      orderInfo,
      outlet,
      clearItems,
      updateOrder,
      addOrderItem
    } = this.props;
    if (orderInfo.outlet_uuid !== outlet.outlet_uuid) {
      // first time or reset
      if (
        !orderInfo.outlet_uuid ||
        window.confirm("Do you want to clear current orders?")
      ) {
        clearItems();
      } else {
        return;
      }
    }

    const {
      default_price,
      item_options,
      item_uuid,
      currency,
      name,
      description
    } = item;

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

  loadCategories = async () => {
    let categories = [];
    const { outlet } = this.props;
    var hasMore = true,
      page = 1;
    while (hasMore) {
      var retOutletCaterogies = await api.restaurant.getCategories(
        outlet.outlet_uuid,
        page
      );
      hasMore =
        retOutletCaterogies.data.last_page >
        retOutletCaterogies.data.current_page;
      // update gradually
      categories = categories.concat(retOutletCaterogies.data.data);
      this.setState({
        categories
      });
      page++;
    }
  };

  componentDidMount() {
    this.loadCategories();
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

    if (outlet.total_items) {
      categories.forEach(item => {
        treeCategoryName[item.category_uuid] = item.name;
        if (item.parent_uuid) {
          if (treeCategory.hasOwnProperty(item.parent_uuid)) {
            treeCategory[item.parent_uuid].push(item.category_uuid);
          } else {
            treeCategory[item.parent_uuid] = [item.category_uuid];
          }
          if (item.total_items) {
            categoryHasChildProduct.push(item.parent_uuid);
          }
        } else {
          if (!treeCategory.hasOwnProperty(item.category_uuid)) {
            treeCategory[item.category_uuid] = [item.category_uuid];
          }
        }
      });

      return (
        <div
          className={classNames("row block bg-white mb-4 mt-5", toggleClass)}
          id="restaurant-body"
        >
          {features.length ? (
            <Slider className="mt-2" num={5} move={1}>
              {features.length
                ? features.map((item, index) => (
                    <ProductItemPhoto
                      key={index}
                      price={10}
                      title={item.name}
                      image={
                        item.gallery
                          ? JSON.parse(item.gallery)[0]
                          : "/images/donut-square.png"
                      }
                    />
                  ))
                : ""}
            </Slider>
          ) : (
            ""
          )}

          <div className="mt-3 row w-100">
            <Menu className="col col-md-2 list-group restaurant-cat">
              {categories
                .filter(
                  item =>
                    !item.parent_uuid &&
                    (categoryHasChildProduct.indexOf(item.category_uuid) > -1 ||
                      item.total_items)
                )
                .map((item, index) => {
                  return (
                    <MenuItem
                      onClick={() => this.handleCategory(item.category_uuid)}
                      key={item.category_uuid}
                      title={item.name}
                      clickIt={!index}
                    />
                  );
                })}
            </Menu>

            {!isLoadingItem ? (
              <RestaurantProduct
                products={products}
                treeCategoryName={treeCategoryName}
                onAddOrder={this.canAddOrder ? this.addOrderItem : null}
              />
            ) : (
              this.showLoading()
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        className={classNames("row block bg-white mb-4 mt-5", toggleClass)}
        id="restaurant-body"
      >
        <div className="d-block text-center w-100 py-5">
          <Image src="/images/no-data.png" height="100" alt="" />
          <p className="color-gray text-uppercase">
            {t("LABEL.NO_SEARCH_DATA")}
          </p>
        </div>
      </div>
    );
  }
}