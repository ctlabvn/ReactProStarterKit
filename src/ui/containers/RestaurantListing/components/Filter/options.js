import React from "react";

/*
The user can filter by
Location
  All
  City-district
Distance
  All
  <= 1km
  <= 2km
  <= 5km
  <= 10km
Ordering methods
  All
  Delivery
  Take-away
  Pre-order
  Delivery fee
  All
Fee
  <=20,000 : less than 20,000
  <= 50,000 : less than 50,000
Minimum order
  All
  <= 100,000 : less than 100,000
  <= 200,000 : less than 200,000
Tags
  All
  Each tag name
 */
// can have event here
export default {
	filters: [
		{
			placement: 'bottom',
			text: 'BUTTON.FILTER.LOCATION',
			body: 
				<div className="w-100">
					<ul className="list-unstyled">
						<li>All</li>
						<li>Ha Noi</li>
					</ul>
				</div>
			
		},
		{
			placement: 'bottom',
			text: 'BUTTON.FILTER.DISTANCE',
			body: 
				<div className="w-100">
					<ul className="list-unstyled">
						<li>All</li>
						<li>Delivery</li>
						<li>Take-away</li>
						<li>Pre-order</li>
						<li>Delivery fee</li>
					</ul>
				</div>
			
		},
		{
			placement: 'bottom',
			text: 'BUTTON.FILTER.ORDERING_METHODS',
			body: 
				<div className="w-100">
					<ul className="list-unstyled">
						<li>All</li>
						<li>&lt;= 1km</li>
						<li>&lt;= 2km</li>
						<li>&lt;= 5km</li>
						<li>&lt;= 10km</li>
					</ul>
				</div>
			
		},
		{
			placement: 'bottom',
			text: 'BUTTON.FILTER.FEES',
			body: 
				<div className="w-100">
					<ul className="list-unstyled">
						<li>All</li>
						<li>&lt;= 20,000</li>
						<li>&lt;= 50,000</li>
					</ul>
				</div>
			
		},
		{
			placement: 'bottom',
			text: 'BUTTON.FILTER.MINIMUM_ORDER',
			body: 
				<div className="w-100">
					<ul className="list-unstyled">
						<li>All</li>
						<li>&lt;= 100,000</li>
						<li>&lt;= 200,000</li>
					</ul>
				</div>
			
		},
		{
			placement: 'bottom',
			text: 'BUTTON.FILTER.TAGS',
			body: 
				<div className="w-100">
					<ul className="list-unstyled">
						<li>All</li>
					</ul>
				</div>
			
		}
	]
};

