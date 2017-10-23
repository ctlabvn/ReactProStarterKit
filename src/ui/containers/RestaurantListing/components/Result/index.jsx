import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import { connect } from "react-redux";

// component
import InfiniteScroller from "~/ui/components/Scroller/Infinite";
import RestaurantItemPhoto from "~/ui/components/Restaurant/Item/Photo";

// store
import api from "~/store/api";
import options from "./options";
import "./index.css";

// selectors && actions
import * as authActions from "~/store/actions/auth";
import * as authSelectors from "~/store/selectors/auth";

@translate('translations')
@connect(state => ({
	config: authSelectors.getConfig(state),
}), {...authActions})
export default class extends Component {

	constructor(props) {
    super(props);
    this.state = {
      hasMore: true,
      elements: []
    };
    this.page = 1
  }

	loadMoreElement = async () => {
		const { config } = this.props;
		if(config.searchStr) {
			await api.restaurant.searchOutlet(this.page, config.searchStr).then((ret) => {
				this.updateView(ret);
			}, (err) => {
				console.log(err)
			})
		} else {
			await api.restaurant.getOutlets(this.page).then((ret) => {
				this.updateView(ret);
			}, (err) => {
				console.log(err)
			})
		}
	}

	updateView = (ret) => {
		if(!ret.status && ret.data.data) {
			const data = ret.data.data
			this.page++
			this.setState(prevState => ({
				elements: prevState.elements.concat(data),
				hasMore: data.length > 0
			}))
		}
	}

	componentWillReceiveProps(nextProps) {
		const { config } = this.props;
		if(config.searchStr && config.searchStr.length >= 3) {
			this.setState({hasMore: true, elements: []});
			this.page = 1;
			this.loadMoreElement();
		}
	}

	showLoading = () => (
		<div className="col-12 text-center d-flex flex-row justify-content-center py-2">
			<i className="fa fa-refresh fa-spin fa-3x fa-fw"></i>
		</div>
	)

  render() {
    const { elements } = this.state
	  return (
      <div className="container-fluid bg-white py-4">
        <InfiniteScroller
            className="row d-flex"
            hasMore={this.state.hasMore}
            loader={this.showLoading()}
            loadMore={this.loadMoreElement}
          >
            {
	            elements.map((item, i) => (
		            <RestaurantItemPhoto
                  key={item.outlet_uuid}
                  uuid={item.outlet_uuid}
                  name={item.name}
                  address={item.address}
                  logo={item.logo}
                  restaurant={item}
                />
              ))
            }
          </InfiniteScroller>
      </div>
    )
  }

}