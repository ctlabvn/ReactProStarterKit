import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";

// component
import InfiniteScroller from "~/ui/components/Scroller/Infinite";
import RestaurantItemPhoto from "~/ui/components/Restaurant/Item/Photo";

// store
import api from "~/store/api";
import options from "./options";
import "./index.css";


@translate('translations')
export default class extends Component {

	constructor(props) {
    super(props);
    this.state = {
      hasMore: true,
      elements: [],
    };
    this.page = 1
  }

	loadMore = async () => {
		await api.restaurant.getOutlets(this.page).then((ret) => {
			const data = ret.data.data;
			this.page++;
			this.setState(state => ({
				elements: state.elements.concat(data),
				hasMore: data.length > 0,
			}));
		}, (err) => {
			console.log(err);
		});
	};

  render() {
    
    const { t } = this.props;
    const { elements } = this.state;
	  return (
      <div className="container-fluid bg-white py-4">
        <InfiniteScroller
            className="masonry row d-flex justify-content-center"
            hasMore={this.state.hasMore}
            sizes={options.sizes}
            loader={
              <div className="d-flex flex-row justify-content-center py-2">
                <i className="fa fa-refresh fa-spin fa-3x fa-fw"></i>
              </div>
            }
            loadMore={this.loadMore}
          >
            {
	            elements.map((item, i) => (
                <RestaurantItemPhoto
                  key={item.outlet_uuid}
                  uuid={item.outlet_uuid}
                  name={item.name}
                  address={item.address}
                  logo={item.logo}
                  image="/images/donut-square.png"
                />
              ))
            }
          </InfiniteScroller>
      </div>
    );

  }
}