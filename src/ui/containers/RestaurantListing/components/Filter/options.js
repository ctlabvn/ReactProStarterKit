import React, { Component } from "react";

export default {
	filters: [
		{
			placement: 'bottom',
			text: 'BUTTON.FILTER.LOCATION',
			body: `
				<div className="w-100">
					<ul className="list-unstyled">
						<li>All</li>
						<li>Ha Noi</li>
					</ul>
				</div>
			`
		},
		{
			placement: 'bottom',
			text: 'BUTTON.FILTER.DISTANCE',
			body: `
				<div className="w-100">
					<ul className="list-unstyled">
						<li>All</li>
						<li><= 1km</li>
						<li><= 2km</li>
						<li><= 5km</li>
						<li><= 10km</li>
					</ul>
				</div>
			`
		},
		{
			placement: 'bottom',
			text: 'BUTTON.FILTER.ORDERING_METHODS',
			body: `
				<div className="w-100">
					<ul className="list-unstyled">
						<li>All</li>
						<li>Delivery</li>
						<li>Take-away</li>
						<li>Pre-order</li>
						<li>Delivery fee</li>
					</ul>
				</div>
			`
		},
		{
			placement: 'bottom',
			text: 'BUTTON.FILTER.FEES',
			body: `
				<div className="w-100">
					<ul className="list-unstyled">
						<li>All</li>
						<li><= 20,000</li>
						<li><= 50,000</li>
					</ul>
				</div>
			`
		},
		{
			placement: 'bottom',
			text: 'BUTTON.FILTER.MINIMUM_ORDER',
			body: `
				<div className="w-100">
					<ul className="list-unstyled">
						<li>All</li>
						<li><= 100,000</li>
						<li><= 200,000</li>
					</ul>
				</div>
			`
		},
		{
			placement: 'bottom',
			text: 'BUTTON.FILTER.TAGS',
			body: `
				<div className="w-100">
					<ul className="list-unstyled">
						<li>All</li>
					</ul>
				</div>
			`
		}
	]
};

