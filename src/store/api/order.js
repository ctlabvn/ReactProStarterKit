import { apiGet, apiPost } from "./common";

export default {
  createOrder(token, data) {
    return apiPost(`/order?token=${token}`, data);
  },

  getOrderHistory(token, options) {
    return apiGet("/customer/customer-order-list", {
      token,
      ...options
    });
  }
};
