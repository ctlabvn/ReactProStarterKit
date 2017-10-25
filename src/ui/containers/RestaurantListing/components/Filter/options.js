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
export default {
  filters: {
    'filters.all_locations': ["Ha Noi", "Hai Phong", "Sai Gon"],
    'filters.all_prices': [100, 500, 1000],
    'filters.all_ratings': [1, 3, 5]
  }
};