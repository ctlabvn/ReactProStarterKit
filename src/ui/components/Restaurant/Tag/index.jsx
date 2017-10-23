import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { Badge } from 'reactstrap';

import api from "~/store/api";
import './index.css';

@translate('translations')
export default class extends Component {
	constructor(props) {
		super(props)
		this.state = {
			tags: []
		}
	}

	componentDidMount() {
		this.getRestaurantTag(this.props.outlet.outlet_uuid)
	}

	getRestaurantTag = outlet_uuid => {
		api.restaurant.getRestaurantTag(outlet_uuid).then(ret => {
			if(ret.data.outlet_tags) {
				this.setState({tags: ret.data.outlet_tags})
			}
		}, err => console.log(err))
	}

	render() {
		const { tags } = this.state;
		if(tags.length) {
			return (
				<div id="restaurant-tags" className="mt-3">
					{tags && tags.map((item, index) => (
						<Badge color="secondary mr-2 text-default">{item.name}</Badge>
					))}
				</div>
			);
		}

		return (
			<div className="clearfix"></div>
		);
	}
}