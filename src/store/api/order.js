import { apiGet, apiPost } from './common'

export default {
  createOrder(data){
    return apiPost('/order', data);
  },

  getOrderHistory(token, options){
    return apiGet('/customer/customer-order-list', {
      token,
      ...options,
    })
  },
}

