import { apiGet, apiPost } from './common'

export default {
  getOutlets(){
    return apiGet('/restaurant/outlets')
  }
}

