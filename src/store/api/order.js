import { apiGet, apiPost } from './common'

export default {
  createOrder(data){
    return apiPost('/order', data);
  }
}

