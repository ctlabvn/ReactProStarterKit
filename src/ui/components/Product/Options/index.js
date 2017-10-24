import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";

import { translate } from "react-i18next";

import HeadingDouble from "~/ui/components/Heading/Double";
import ButtonRound from "~/ui/components/Button/Round";

@translate("translations")
export default class extends Component {
	static propTypes = {
		options: PropTypes.array
	};

	render() {
		const { t, options, name } = this.props;
		return (
			<div className="row my-3">
				<div className="col">{name}</div>
				<div className="col-10 row">
					{options.map((item, index) => (
						<div className="col-lg-4">
							<p>{item.name} {item.price > 0 && (
								<small className="badge badge-danger">
									{t("format.currency", {
										price: item.price,
										symbol: 'đ'
									})}
								</small>
							)}
							</p>
						</div>
					))}
				</div>
			</div>
		);
	}
}