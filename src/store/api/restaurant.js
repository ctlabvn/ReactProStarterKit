/* eslint-disable */
import { apiGet, apiPost } from "./common";
import i18n from "~/i18n";

export default {
  getOutlets(page = 1) {
    return apiGet("/restaurant/outlets", { page: page, pagination: 20 });
  },

  searchOutlet(page = 1, term = "") {
    return apiGet("/restaurant/search", {
      page: page,
      keyword: term,
      pagination: 20
    });
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
      lang: i18n.language,
      limit: 2
    });
  }
};