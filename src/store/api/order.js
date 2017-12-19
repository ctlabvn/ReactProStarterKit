import { apiGet, apiPost } from "./common";

export default {
  createOrder(token, data) {
    return apiPost(`/order`, data, token);
  },

  getOrderHistory(token, options) {
    return apiGet("/customer/customer-order-list", options, token);
  }
};
