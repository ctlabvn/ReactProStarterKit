// import React from "react";

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
	filters: {
		location: {
			placement: 'bottom',
			text: 'BUTTON.FILTER.LOCATION',
			name: 'filter[location]',
			body: {'' : 'All'}
		},
		distance: {
			placement: 'bottom',
			text: 'BUTTON.FILTER.DISTANCE',
			name: 'filter[distance]',
			body: {'' : 'All'}
		},
		ordering_method: {
			placement: 'bottom',
			text: 'BUTTON.FILTER.ORDERING_METHODS',
			name: 'filter[order_method]',
			body: {'' : 'All'}
		},
		delivery_fee: {
			placement: 'bottom',
			text: 'BUTTON.FILTER.FEES',
			name: 'filter[fee]',
			body: {'' : 'All'}
		},
		minimum_order: {
			placement: 'bottom',
			text: 'BUTTON.FILTER.MINIMUM_ORDER',
			name: 'filter[min_order]',
			body: {'' : 'All'}
		},
		tags: {
			placement: 'bottom',
			text: 'BUTTON.FILTER.TAGS',
			name: 'filter[tag]',
			body: {'' : 'All'}
		}
	}
};

