/* eslint-disable */
import { apiGet, apiPost } from "./common";

export const DEFAULT_PAGINATION = 20;
const restaurant = {
  getOutlets(page = 1) {
    return apiGet("/restaurant/outlets", { page: page, pagination: DEFAULT_PAGINATION });
  },

  searchOutlet(page = 1, term = {}) {
    const data = {...{page: page, pagination: DEFAULT_PAGINATION}, ...term};
    return apiGet("/restaurant/filter", data);
  },

  getOutlet(outlet_uuid) {
    return apiGet(`/restaurant/outlets/${outlet_uuid}`);
  },

  getCategories(outlet_uuid, page = 1) {
    return apiGet("/restaurant/categories", {outlet_uuid, page: page});
  },

  getAllCategories(outlet_uuid) {
    return apiGet("/restaurant/all-categories", {outlet_uuid});
  },

  getProductByCategory(category_uuid) {
    return apiGet("/restaurant/items", {
      category_uuid: category_uuid,
      pagination: 10000
    });
  },

  getProductByCategories(categories_uuid) {    
    return Promise.all(categories_uuid.map(category_uuid => restaurant.getProductByCategory(category_uuid)));
  },

  getFeatureItem(outlet_uuid) {
    return apiGet("/restaurant/featured/items", {
      outlet_uuid: outlet_uuid,
      featured: 1
    });
  },

  getRestaurantTag(outlet_uuid) {
    return apiGet("/restaurant/tags", { outlet_uuid: outlet_uuid });
  },

  getSuggestion(keyword) {
    return apiGet("/restaurant/suggestion", {
      keyword,
      limit: 2
    });
  },

  getProductFeatured(outlet_uuid, featured=1) {
    return apiGet("/restaurant/featured/items", {
      outlet_uuid,
      featured,
      pagination: DEFAULT_PAGINATION
    });
  },
};

export default restaurant;