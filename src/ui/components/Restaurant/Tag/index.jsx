import React, { Component } from "react";
// import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { translate } from "react-i18next";

import { Badge } from 'reactstrap';

import * as commonActions from "~/store/actions/common";

import './index.css';

@translate('translations')
@connect(null, commonActions)
export default class extends Component {
	constructor(props) {
		super(props)
		this.state = {
			tags: []
		}
	}

	componentDidMount() {
		const {requestor, outlet} = this.props;
		requestor("restaurant/getRestaurantTag", outlet.outlet_uuid, (err, ret)=>{
			if(ret.data){
				this.setState({tags: ret.data})
			}
		})
	}

	render() {
		const { tags } = this.state;
		if(tags) {
			return (
				<div id="restaurant-tags" className="mt-3">
					{tags.map((item, index) => (
						<Link to={`/restaurant?tags=${item.tag_uuid}`} key={index}>
							<Badge key={index} color="secondary mr-2 text-default">{item.name}</Badge>
						</Link>
					))}
				</div>
			);
		}

		return (
			<div className="clearfix"></div>
		);
	}
}