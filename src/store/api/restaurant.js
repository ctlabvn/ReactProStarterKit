/* eslint-disable */
import { apiGet, apiPost } from "./common";

export const DEFAULT_PAGINATION = 20;
export default {
  getOutlets(page = 1) {
    return apiGet("/restaurant/outlets", { page: page, pagination: DEFAULT_PAGINATION });
  },

  searchOutlet(page = 1, term = {}) {
    const data = {...{page: page, pagination: DEFAULT_PAGINATION}, ...term};
    return apiGet("/restaurant/filter", data);
  },

  getOutlet(uuid) {
    return apiGet(`/restaurant/outlets/${uuid}`);
  },

  getCategories(uuid, page = 1) {
    return apiGet(`/restaurant/categories`, {outlet_uuid: uuid, page: page});
  },

  getProductByCategory(category_uuid) {
    return apiGet("/restaurant/items", {
      category_uuid: category_uuid,
      pagination: 10000
    });
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
  }
};