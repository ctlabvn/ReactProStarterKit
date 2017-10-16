import { apiGet, apiPost } from './common'

export default {
  getOutlets(page = 1){
    return apiGet('/restaurant/outlets', {page: page, pagination: 12})
  },

  getOutlet(uuid){
    return apiGet(`/restaurant/outlets/${uuid}`)
  },
}

